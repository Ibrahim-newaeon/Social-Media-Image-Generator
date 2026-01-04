import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Minimize2, Maximize2, Loader2, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatAssistantProps {
  onSendMessage?: (message: string) => Promise<string>;
}

export default function ChatAssistant({ onSendMessage }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. I can help you create better image prompts for your furniture brand. What would you like to know?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let response: string;
      if (onSendMessage) {
        response = await onSendMessage(input);
      } else {
        // Default helpful responses
        response = getDefaultResponse(input);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("prompt") || lowerQuery.includes("write")) {
      return "For furniture prompts, be specific about:\n• Material (wood, marble, velvet)\n• Style (modern, traditional, minimalist)\n• Setting (living room, bedroom)\n• Lighting (natural, warm, studio)\n• Composition (centered, angled)\n\nExample: 'Modern grey velvet sectional sofa in bright minimalist living room with natural sunlight, neutral color palette'";
    }

    if (lowerQuery.includes("color") || lowerQuery.includes("palette")) {
      return "For GCC markets, these color palettes work well:\n• Luxury: Champagne gold, navy, cream\n• Modern: White, light wood, grey\n• Traditional: Burgundy, gold, deep green\n• Romantic: Blush, rose gold, champagne\n\nAlways consider cultural preferences - warm tones are generally preferred.";
    }

    if (lowerQuery.includes("audience") || lowerQuery.includes("market")) {
      return "Key tips for GCC audiences:\n• Kuwait: Modern with Arabic touches, family-friendly\n• Saudi: Mix of traditional and contemporary, prayer corners\n• Qatar: Ultra-luxury, gallery-style presentations\n\nRemember: No human figures in images, bilingual text (Arabic primary), and cultural sensitivity are important.";
    }

    if (lowerQuery.includes("logo") || lowerQuery.includes("watermark")) {
      return "Logo watermark best practices:\n• Use PNG with transparency\n• Position: Bottom-right is standard\n• Size: 20-30% of image width\n• Opacity: 70-90% for visibility\n\nMake sure your logo contrasts well with typical furniture backgrounds.";
    }

    return "I can help you with:\n• Writing effective prompts\n• Choosing color palettes\n• Understanding GCC audience preferences\n• Logo watermark settings\n\nWhat would you like to know more about?";
  };

  return (
    <div
      className={`fixed bottom-0 right-0 z-50 transition-all duration-300 ${
        isMinimized ? "w-auto" : "w-full max-w-md"
      }`}
    >
      {/* Minimized Button */}
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          className="m-4 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <div className="m-4 bg-card border rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="h-80 p-4">
            <div className="space-y-4" ref={scrollRef}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted p-3 rounded-xl">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
