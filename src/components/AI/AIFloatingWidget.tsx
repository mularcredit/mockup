import { useState, useRef, useEffect } from "react";
import { queryDeepSeek } from "../../services/deepseek";
import { MessageCircle, X, Send, Bot, User, MessageCircleMore, Cpu, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatFloater = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurvedText, setShowCurvedText] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide curved text after 5 seconds
  useEffect(() => {
    if (showCurvedText && !isOpen) {
      const timer = setTimeout(() => {
        setShowCurvedText(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showCurvedText, isOpen]);

  const systemPrompt = `You are Zira, the workforce intelligence assistant.
  Please use professional, normal, and friendly English.
  
  LOAN_PORTFOLIO_GUIDELINES:
  - New branches (≤ 3m) target 30 loans; established (> 3m) target 25 loans.
  - Formula: Loan Count = New Loans + Repeat Loans.
  - Retention: Achieve ≥ 80% retention of previous borrowers.
  - Average Value: Disbursement / Count (Default 5,000 KES).
  - OLB Projection: (Prev OLB × 0.8) + (New Loans × Avg Value).
  
  Please present data clearly using cards or highlights where appropriate.`;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const newMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    const context = [systemPrompt, ...messages.slice(-6).map(m => `${m.role}: ${m.content}`), `user: ${currentInput}`].join('\n');

    try {
      const result = await queryDeepSeek(currentInput, context);
      const responseContent = result?.response || result?.choices?.[0]?.message?.content || "I'm sorry, I'm having trouble connecting right now.";
      const formattedResponse = formatAssistantResponse(responseContent);
      
      setMessages((prev) => [...prev, { role: "assistant", content: formattedResponse, timestamp: new Date() }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I've encountered a connection error.", timestamp: new Date() }]);
    }
    setLoading(false);
  };

  const formatAssistantResponse = (response) => {
    return response
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--p)] font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-[var(--t3)] italic">$1</em>')
      .replace(/^-\s+(.*)$/gm, '• $1')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(timestamp);
  };

  return (
    <div className="font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            {showCurvedText && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute -top-16 -right-4 transform rotate-6"
              >
                <div className="bg-[var(--p-dim)] border border-[var(--p-glow)] px-4 py-2 rounded-2xl backdrop-blur-md shadow-[0_0_15px_var(--p-dim)]">
                  <span className="text-[11px] font-semibold text-[var(--p)]">I'm here to help</span>
                </div>
              </motion.div>
            )}

            <button
              onClick={() => setIsOpen(true)}
              onMouseEnter={() => setShowCurvedText(true)}
              className="group relative glass-card !p-1.5 !rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 !border-[var(--p-line)] hover:!border-[var(--p)]"
            >
              <div className="relative">
                <img src="/avatars.png" alt="Zira" className="w-10 h-10 object-cover rounded-full border border-[var(--p-line)]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--green)] border-2 border-[var(--sidebar)] rounded-full animate-pulse shadow-[0_0_8px_var(--green-glow)]"></div>
              </div>
              <div className="absolute inset-0 rounded-full bg-[var(--p-dim)] animate-ping opacity-20 -z-10"></div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: 100, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 100, scale: 0.9, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[580px] glass-card !p-0 !rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] !border-[var(--p-line)] flex flex-col overflow-hidden"
          >
            <div className="p-5 bg-gradient-to-r from-[var(--p-dim)] to-[var(--sidebar)] border-b border-[var(--p-line)] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src="/avatars.png" alt="Zira" className="w-10 h-10 object-cover rounded-full border border-[var(--p-line)] shadow-[0_0_10px_var(--p-dim)]" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--green)] border-2 border-[var(--sidebar)] rounded-full shadow-[0_0_5px_var(--green-glow)]"></div>
                </div>
                <div>
                  <h2 className="text-[var(--t1)] font-semibold text-sm">Zira intelligence</h2>
                  <p className="text-[var(--p)] text-[10px] font-medium opacity-80">Assistant is active</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => setMessages([])} className="p-2 hover:bg-[var(--glass-h)] rounded-lg text-[var(--t4)] transition-all">
                  <Cpu size={14} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[var(--red-d)] hover:text-[var(--red)] rounded-full text-[var(--t4)] transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 thin-scrollbar bg-[var(--sidebar)]/40">
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <div className="w-20 h-20 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_var(--p-dim)]">
                    <Bot size={32} className="text-[var(--p)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[var(--t1)] text-sm font-semibold">Hello! I'm Zira</p>
                    <p className="text-[var(--t4)] text-[11px] font-medium max-w-[200px] mx-auto opacity-70">I'm here to help you analyze your workforce data and portfolio performance.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-4">
                    <button onClick={() => setInput("Calculate branch projections")} className="text-[11px] text-[var(--p)] font-semibold hover:bg-[var(--p-dim)] p-2.5 rounded-xl border border-[var(--p-line)] transition-all text-center">Portfolio projections</button>
                    <button onClick={() => setInput("Analyze branch retention")} className="text-[11px] text-[var(--p)] font-semibold hover:bg-[var(--p-dim)] p-2.5 rounded-xl border border-[var(--p-line)] transition-all text-center">Retention analysis</button>
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ x: msg.role === "user" ? 20 : -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-[var(--p)] text-[var(--sidebar)] rounded-br-none shadow-[0_0_15px_var(--p-dim)]"
                      : "bg-[var(--glass)] border border-[var(--p-line)] text-[var(--t2)] rounded-bl-none shadow-sm"
                  }`}>
                    <div className={`text-[13px] leading-relaxed font-medium`} dangerouslySetInnerHTML={{ __html: msg.content }} />
                    <div className={`text-[9px] mt-2 font-semibold opacity-60 ${msg.role === "user" ? "text-[var(--sidebar)]" : "text-[var(--t4)]"}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--glass)] border border-[var(--p-line)] p-4 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-[var(--p)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-[var(--p)] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-[var(--p)] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-5 bg-[var(--sidebar)] border-t border-[var(--p-line)]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask me a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full px-5 py-4 bg-[var(--glass)] border border-[var(--p-line)] rounded-xl text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-[var(--p)] transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--p)] text-[var(--sidebar)] rounded-lg disabled:opacity-30 transition-all hover:scale-105"
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-[9px] text-[var(--t4)] font-semibold">Zira intelligence v2.4.0</p>
                <p className="text-[9px] text-[var(--p)] font-semibold">Active session</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatFloater;