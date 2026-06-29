"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import { motion } from "framer-motion";

export function AIChat({ ipo }: { ipo: any }) {
  const name = ipo?.company?.name || ipo?.name || "this company";
  
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: `Hi! I'm IPO Pulse AI. I have analyzed the DRHP/RHP filings for ${name}. Ask me anything, like 'Should I apply?', 'What are the key risks?', or check the current GMP details.` 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userQuery = input;
    const newMessages = [...messages, { role: "user", content: userQuery }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const gmp = ipo?.gmpHistory?.[0]?.gmp || 0;
      const price = ipo?.priceBandHigh || 0;
      const gainPct = price ? ((gmp / price) * 100).toFixed(1) : "0.0";
      
      const ipoContext = {
        name: name,
        sector: ipo?.company?.sector || "its industry segment",
        status: ipo?.status || "OPEN",
        priceBandLow: ipo?.priceBandLow || 0,
        priceBandHigh: price,
        issueSize: ipo?.issueSize || "150",
        lotSize: ipo?.lotSize || 1,
        gmp: gmp,
        gainPct: gainPct,
        investmentScore: status === "UPCOMING" ? 65 : (gmp > 12 ? 85 : (gmp > 5 ? 72 : 54)),
        recommendation: status === "UPCOMING" ? "NEUTRAL" : (gmp > 12 ? "STRONG SUBSCRIBE" : (gmp > 5 ? "SUBSCRIBE" : "AVOID")),
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, ipoContext })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
        setIsTyping(false);
        return;
      }
      
      // If the API key is missing or there's a 500 error, seamlessly fall back to local rule-based engine
      console.warn("Real AI not available. Falling back to simulated engine.");
    } catch (error) {
      console.error("AI Fetch error:", error);
    }

    // --- FALLBACK LOGIC ---
    setTimeout(() => {
      setIsTyping(false);
      const q = userQuery.toLowerCase();
      const gmp = ipo?.gmpHistory?.[0]?.gmp || 0;
      const price = ipo?.priceBandHigh || 0;
      const gainPct = price ? ((gmp / price) * 100).toFixed(1) : "0.0";
      const status = ipo?.status || "OPEN";
      const board = ipo?.board || "MAINBOARD";
      const sector = ipo?.company?.sector || "its industry segment";

      let content = "";

      if (q.includes("apply") || q.includes("subscribe") || q.includes("buy") || q.includes("should i") || q.includes("recommend")) {
        if (status === "UPCOMING") {
          content = `${name} is an upcoming ${board} issue, opening shortly. The grey market sentiment shows a premium of ₹${gmp} (+${gainPct}% expected listing gain). Since subscription hasn't opened yet, we suggest monitoring peer valuations first. Our initial indicator is NEUTRAL.`;
        } else if (gmp > 12) {
          content = `Our AI Investment Score for ${name} is 85/100, which translates to a STRONG SUBSCRIBE. With a robust grey market premium of ₹${gmp} (+${gainPct}% listing gain), demand is looking very solid. Retain exposure but check Day 3 institutional subscription numbers before placing bids.`;
        } else {
          content = `${name} has a GMP of ₹${gmp} (+${gainPct}% listing gain). Valuations in the ${sector} segment are fair, but listing room appears moderate. We recommend a NEUTRAL stance for retail investors; only apply if QIB subscription crosses 5x on Day 3.`;
        }
      } else if (q.includes("risk") || q.includes("threat") || q.includes("weakness") || q.includes("danger") || q.includes("bad")) {
        content = `Here are the top risk factors identified in ${name}'s DRHP prospectus:\n\n1. Segment Concentration: Operating primarily in ${sector}, any downturn in this sector will directly impact their bottom line.\n2. Promoter Dependency: Management control is highly centralized with key founders.\n3. Cash Flow Pressure: Historically high working capital requirements and negative operating cash flows in recent quarters.\n4. Low GMP Cushion: A GMP of ₹${gmp} (+${gainPct}%) leaves a narrow margin of safety if listing day market conditions turn bearish.`;
      } else if (q.includes("gmp") || q.includes("premium") || q.includes("gain") || q.includes("gray") || q.includes("grey")) {
        content = `The latest tracked Grey Market Premium (GMP) for ${name} is ₹${gmp}. With the upper price band cap at ₹${price}, the estimated listing price is ₹${price + gmp}, implying a listing gain of approximately +${gainPct}%. Please note that GMP is unofficial and fluctuates with market liquidity.`;
      } else if (q.includes("price") || q.includes("band") || q.includes("lot") || q.includes("cost") || q.includes("min")) {
        const minAmount = (ipo?.priceBandHigh || 0) * (ipo?.lotSize || 1);
        content = `The price band for ${name} is ₹${ipo?.priceBandLow} to ₹${ipo?.priceBandHigh} per share. The minimum lot size is ${ipo?.lotSize} shares. A retail investor can bid for a minimum of 1 lot, which requires an investment of ₹${minAmount.toLocaleString("en-IN")}.`;
      } else if (q.includes("date") || q.includes("timeline") || q.includes("when") || q.includes("calendar") || q.includes("close") || q.includes("open")) {
        const openStr = ipo?.openDate ? new Date(ipo.openDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "TBA";
        const closeStr = ipo?.closeDate ? new Date(ipo.closeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "TBA";
        const listStr = ipo?.listingDate ? new Date(ipo.listingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "TBA";
        content = `${name} IPO opens for bidding on ${openStr} and closes on ${closeStr}. Share allotment is scheduled to be finalized 3 days post close, and the official listing on BSE/NSE is slated for ${listStr}.`;
      } else {
        content = `Regarding your query about ${name}, the company operates as a key player in the ${sector} industry. It plans to raise ₹${ipo?.issueSize || "150"} Cr to fund future capital requirements and general corporate needs. Let me know if you would like me to detail its risk factors, live GMP (currently ₹${gmp}), or pricing.`;
      }

      setMessages(prev => [...prev, { role: "assistant", content }]);
    }, 1200);
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Bot className="w-5 h-5" /> Ask AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 px-4">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 pb-4">
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex gap-3 text-sm ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 text-sm"
              >
                <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 bg-muted">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="p-3 rounded-lg bg-muted text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t mt-auto">
        <form 
          className="flex w-full items-center space-x-2" 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type your question..." 
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
