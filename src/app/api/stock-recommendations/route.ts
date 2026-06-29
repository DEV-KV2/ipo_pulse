import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getLiveQuotes } from "@/lib/yahoo-finance";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "Stocks";

    let symbols: string[] = [];
    if (category === "Funds") {
      symbols = ["0P0000XW8F.BO", "0P0000XVUA.BO", "0P0000XW8C.BO", "0P0000XVU7.BO", "0P0001B61I.BO"];
    } else if (category === "ETFs") {
      symbols = ["NIFTYBEES.NS", "BANKBEES.NS", "LIQUIDBEES.NS", "GOLDBEES.NS", "MON100.NS"];
    } else if (category === "IPOs") {
      // Just some recently listed popular IPOs
      symbols = ["IREDA.NS", "TATATECH.NS", "DOMS.NS", "MUTHOOTMF.NS", "INNOKA.NS"];
    } else {
      symbols = [
        "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", 
        "ITC.NS", "SBIN.NS", "ICICIBANK.NS", "WIPRO.NS", 
        "TATAMOTORS.NS", "LT.NS", "M&M.NS"
      ];
    }
    
    const quotes = await getLiveQuotes(symbols);
    
    // 2. Identify top gainers
    let gainers = [...quotes]
      .filter(q => q.percent_change > 0)
      .sort((a, b) => b.percent_change - a.percent_change)
      .slice(0, 5);

    if (gainers.length === 0 && quotes.length > 0) {
      // Fallback: if everything is red, pick the least-down assets
      gainers = [...quotes]
        .sort((a, b) => b.percent_change - a.percent_change)
        .slice(0, 5);
    }

    if (gainers.length === 0) {
      return NextResponse.json({
        trendingUp: [],
        topPick: null,
        message: "No live data available at the moment."
      });
    }

    // 3. Ask Gemini for a recommendation based on these gainers
    const apiKey = process.env.GEMINI_API_KEY;
    
    const generateHeuristic = () => {
      const topPick = gainers[0];
      return NextResponse.json({
        trendingUp: gainers.slice(0, 3).map(g => g.company_name),
        topPick: {
          symbol: topPick.symbol,
          name: topPick.company_name,
          reason: `Based on real-time market data, ${topPick.company_name} is showing relative strength today. Technical indicators suggest it is a compelling asset to watch in the current market conditions.`
        },
        _fallback: true
      });
    };

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using heuristic fallback.");
      return generateHeuristic();
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are an elite Wall Street quantitative analyst. 
        Analyze the following best performing Indian ${category} for today (which might be the ones that dropped the least if the overall market is down) and pick ONE asset as the absolute best buy recommendation. 

        Top Performers Today:
        ${gainers.map((g, i) => `${i + 1}. ${g.company_name} (${g.symbol}): ${g.percent_change >= 0 ? '+' : ''}${g.percent_change.toFixed(2)}%`).join("\n")}

        Provide a strict JSON response with the following format:
        {
          "trendingUp": string[] (Array of the top 3 company names that are performing best today),
          "topPick": {
            "symbol": string (The exact ticker symbol of your chosen stock),
            "name": string (The company name of your chosen stock),
            "reason": string (A punchy, 2-3 sentence analytical reason why this is the best buy based on momentum and sector)
          }
        }

        Do not include markdown blocks like \`\`\`json, just return the raw JSON object.
      `;

      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch (aiError: any) {
      console.error("Gemini AI Error in stock recommendations:", aiError.message);
      return generateHeuristic();
    }

  } catch (error: any) {
    console.error("Stock Recommendation Route Error:", error.message);
    return NextResponse.json({ error: "Failed to generate stock recommendations" }, { status: 500 });
  }
}
