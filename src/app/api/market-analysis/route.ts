import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let newsContext: any = [];
  
  try {
    const body = await req.json();
    newsContext = body.newsContext || [];

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback heuristic function
    const generateHeuristic = () => {
      const textContext = newsContext.map((n: any) => n.title?.toLowerCase() || "").join(" ");
      let sentiment = "NEUTRAL";
      let summary = "The market is showing steady movements today. Investors are closely watching the latest developments and corporate earnings.";
      
      const bullishWords = ["surge", "jump", "rally", "gain", "up", "high", "positive", "growth", "bull", "record", "soar", "profit", "buy"];
      const bearishWords = ["fall", "drop", "plunge", "crash", "down", "low", "negative", "loss", "bear", "selloff", "decline", "weak", "sell"];
      
      let bullishCount = 0;
      let bearishCount = 0;
      
      bullishWords.forEach(word => { if (textContext.includes(word)) bullishCount++; });
      bearishWords.forEach(word => { if (textContext.includes(word)) bearishCount++; });
      
      if (bullishCount > bearishCount + 1) {
        sentiment = "BULLISH";
        summary = "The market is showing strong upward momentum today, driven by positive news and robust buying interest across key sectors.";
      } else if (bearishCount > bullishCount + 1) {
        sentiment = "BEARISH";
        summary = "The market is facing significant headwinds today, with broader selloffs triggered by recent negative developments.";
      } else if (bullishCount > 0 && bearishCount > 0) {
        sentiment = "MIXED";
        summary = "The market is experiencing volatility with mixed reactions to today's news, balancing both positive growth indicators and underlying concerns.";
      }

      return NextResponse.json({
        sentiment,
        summary,
        keyTakeaways: [
          newsContext[0]?.title || "Market volatility expected to continue.",
          newsContext[1]?.title || "Investors advise caution in short-term trades.",
          "Real-time news sentiment is currently driving intraday movements."
        ],
        _fallback: true
      });
    };

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using heuristic fallback.");
      return generateHeuristic();
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an elite Wall Street quantitative analyst. 
      Analyze the following recent news headlines regarding the Indian stock market and IPOs, and return a structured JSON object with your real-time insights.

      Recent News Headlines:
      ${newsContext.map((n: any, i: number) => `${i + 1}. ${n.title}`).join("\n")}

      Provide a strict JSON response with the following format:
      {
        "sentiment": string (must be exactly one of: "BULLISH", "BEARISH", "NEUTRAL", "MIXED"),
        "summary": string (a punchy, engaging 2-3 sentence summary of the current market mood based on these headlines),
        "keyTakeaways": string[] (exactly 3 short, actionable bullet points highlighting the most important market themes)
      }

      Do not include markdown blocks like \`\`\`json, just return the raw JSON object.
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text);
      return generateHeuristic();
    }

  } catch (error: any) {
    console.error("Market Analysis Error:", error.message);
    
    // If the API rate limits or throws any other error, fallback to heuristic
    if (newsContext && newsContext.length > 0) {
      const textContext = newsContext.map((n: any) => n.title?.toLowerCase() || "").join(" ");
      let sentiment = "NEUTRAL";
      let summary = "The market is showing steady movements today. Investors are closely watching the latest developments and corporate earnings.";
      
      const bullishWords = ["surge", "jump", "rally", "gain", "up", "high", "positive", "growth", "bull", "record", "soar", "profit", "buy"];
      const bearishWords = ["fall", "drop", "plunge", "crash", "down", "low", "negative", "loss", "bear", "selloff", "decline", "weak", "sell"];
      
      let bullishCount = 0;
      let bearishCount = 0;
      
      bullishWords.forEach(word => { if (textContext.includes(word)) bullishCount++; });
      bearishWords.forEach(word => { if (textContext.includes(word)) bearishCount++; });
      
      if (bullishCount > bearishCount + 1) {
        sentiment = "BULLISH";
        summary = "The market is showing strong upward momentum today, driven by positive news and robust buying interest across key sectors.";
      } else if (bearishCount > bullishCount + 1) {
        sentiment = "BEARISH";
        summary = "The market is facing significant headwinds today, with broader selloffs triggered by recent negative developments.";
      } else if (bullishCount > 0 && bearishCount > 0) {
        sentiment = "MIXED";
        summary = "The market is experiencing volatility with mixed reactions to today's news, balancing both positive growth indicators and underlying concerns.";
      }

      return NextResponse.json({
        sentiment,
        summary,
        keyTakeaways: [
          newsContext[0]?.title || "Market volatility expected to continue.",
          newsContext[1]?.title || "Investors advise caution in short-term trades.",
          "Real-time news sentiment is currently driving intraday movements."
        ],
        _fallback: true
      });
    }

    return NextResponse.json({ error: "Failed to generate market analysis" }, { status: 500 });
  }
}
