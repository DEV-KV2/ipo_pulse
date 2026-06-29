import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, ipoContext } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in the environment." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Construct the system prompt using the IPO context
    const systemPrompt = `You are "IPO Pulse AI", a highly intelligent and professional financial assistant specifically focused on analyzing Initial Public Offerings (IPOs) in the Indian Stock Market.

Here is the context of the IPO the user is currently looking at:
- Company Name: ${ipoContext.name}
- Sector: ${ipoContext.sector}
- Status: ${ipoContext.status}
- Price Band: ₹${ipoContext.priceBandLow} to ₹${ipoContext.priceBandHigh}
- Issue Size: ₹${ipoContext.issueSize} Cr
- Lot Size: ${ipoContext.lotSize} shares
- Latest Grey Market Premium (GMP): ₹${ipoContext.gmp} (Expected Listing Gain: +${ipoContext.gainPct}%)
- AI Investment Score: ${ipoContext.investmentScore}/100
- Initial Recommendation: ${ipoContext.recommendation}

Your job is to answer the user's questions about this specific IPO accurately and concisely based on the context provided. Provide a balanced view highlighting both strengths and risks if asked for a recommendation.
Keep your responses relatively brief (1-3 short paragraphs max) unless they ask for detailed analysis. Format your response cleanly without markdown headers, but you can use bullet points or bold text if necessary.`;

    // Format history for Gemini
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will act as IPO Pulse AI and use the provided context to answer questions." }]
        },
        // Skip the very first introductory message to avoid confusing the LLM context flow, or map them correctly
        ...messages.slice(1, -1).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        }))
      ],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const userMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response. Please try again." },
      { status: 500 }
    );
  }
}
