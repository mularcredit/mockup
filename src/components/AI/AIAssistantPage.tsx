import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Database, Users, Activity, Sparkles, BarChart2, ChevronRight, CheckCircle2, Loader2, Wrench } from 'lucide-react'
import { TownProps } from '../../types/supabase'
import { runMCPQuery, MCPMessage } from '../../services/mcpClient'

// ─────────────────────────────────────────────
// FORMAT AI RESPONSE (Markdown → HTML)
// ─────────────────────────────────────────────
const formatAIResponse = (content: string) =>
  content
    .replace(/^### (.*$)/gim, '<h3 class="text-sm font-semibold text-[var(--t1)] mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-base font-semibold text-[var(--t1)] mt-5 mb-3 border-b border-[var(--p-line)] pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-lg font-semibold text-[var(--t1)] mt-6 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-[var(--p)]">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic text-[var(--t3)]">$1</em>')
    .replace(/^[*-] (.*$)/gim, '<li class="flex items-start mb-1.5"><span class="text-[var(--p)] mr-2 mt-0.5 shrink-0">•</span><span>$1</span></li>')
    .replace(/`(.*?)`/gim, '<code class="bg-[var(--p-dim)] text-[var(--p)] px-1.5 py-0.5 rounded text-[11px] font-mono border border-[var(--p-line)]">$1</code>')
    .replace(/\n\n/g, '<br/><br/>');

// Tool display names
const TOOL_LABELS: Record<string, string> = {
  get_employee_count: 'Querying employee count',
  search_employees: 'Searching employee records',
  get_department_breakdown: 'Analyzing department breakdown',
  get_payroll_summary: 'Fetching payroll summary',
  get_hr_alerts: 'Checking HR alerts',
  get_gender_distribution: 'Computing gender distribution',
  get_recent_hires: 'Loading recent hires',
};

const TOOL_ICONS: Record<string, any> = {
  get_employee_count: Users,
  search_employees: Users,
  get_department_breakdown: BarChart2,
  get_payroll_summary: BarChart2,
  get_hr_alerts: Activity,
  get_gender_distribution: Users,
  get_recent_hires: Users,
};

// Suggested prompts
const SUGGESTED_PROMPTS = [
  'How many employees are in Bamburi branch?',
  'What is the gender distribution across all branches?',
  'Show me recent hires in the last 30 days',
  'Give me a department breakdown',
  'Are there any pending HR alerts?',
  'What was the payroll total for this month?',
];

// ─────────────────────────────────────────────
// TOOL CALL INDICATOR COMPONENT
// ─────────────────────────────────────────────
interface ToolCallIndicatorProps {
  toolName: string;
  status: 'calling' | 'done';
  result?: any;
}

const ToolCallIndicator = ({ toolName, status, result }: ToolCallIndicatorProps) => {
  const Icon = TOOL_ICONS[toolName] || Database;
  const label = TOOL_LABELS[toolName] || toolName;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[var(--p-dim)] border border-[var(--p-line)] w-fit text-[11px] font-medium"
    >
      {status === 'calling' ? (
        <Loader2 className="w-3.5 h-3.5 text-[var(--p)] animate-spin shrink-0" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green)] shrink-0" />
      )}
      <Icon className="w-3.5 h-3.5 text-[var(--p)] shrink-0" />
      <span className={status === 'done' ? 'text-[var(--t2)] line-through opacity-60' : 'text-[var(--p)]'}>{label}</span>
      {status === 'done' && result !== undefined && (
        <span className="text-[var(--green)] no-underline" style={{ textDecoration: 'none' }}>
          ✓
        </span>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
interface ConvMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool-stream';
  content: string;
  toolCalls?: Array<{ tool: string; status: 'calling' | 'done'; result?: any }>;
}

export const AIAssistantPage = ({ selectedTown, onTownChange }: TownProps) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<ConvMessage[]>([]);
  const [mcpHistory, setMcpHistory] = useState<MCPMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [currentTown] = useState(selectedTown || 'ADMIN_ALL');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversation, loading]);

  // Load basic stats for the header
  useEffect(() => {
    const loadStats = async () => {
      const { count } = await supabase.from('employees').select('id', { count: 'exact', head: true });
      const { count: activeC } = await supabase.from('employees').select('id', { count: 'exact', head: true }).eq('status', 'active');
      setEmployeeCount(count || 0);
      setActiveCount(activeC || 0);
    };
    loadStats();
  }, []);

  // Welcome message
  useEffect(() => {
    setConversation([{
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm **Zira**, your MCP-powered HR intelligence assistant.\n\nI can access live data from your HR database using structured tools. Ask me anything about your workforce — employees, payroll, departments, alerts, and more.`,
    }]);
  }, []);

  const handleSubmit = async (e?: React.FormEvent, overrideMsg?: string) => {
    e?.preventDefault();
    const query = overrideMsg || message;
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setMessage('');

    const userMsgId = Date.now().toString();
    const streamMsgId = `stream-${Date.now()}`;

    // Add user message
    setConversation(prev => [...prev, { id: userMsgId, role: 'user', content: query }]);

    // Add a "tool-stream" placeholder for live tool call indicators
    setConversation(prev => [...prev, { id: streamMsgId, role: 'tool-stream', content: '', toolCalls: [] }]);

    try {
      const context = `Organization with ${employeeCount} total employees. Current filter: ${currentTown === 'ADMIN_ALL' ? 'All locations' : currentTown}.`;

      const result = await runMCPQuery(
        query,
        mcpHistory,
        context,
        // onToolCall — add indicator as "calling"
        (toolName, args) => {
          setConversation(prev => prev.map(msg =>
            msg.id === streamMsgId
              ? { ...msg, toolCalls: [...(msg.toolCalls || []), { tool: toolName, status: 'calling' as const, args }] }
              : msg
          ));
        },
        // onToolResult — mark indicator as "done"
        (toolName, result) => {
          setConversation(prev => prev.map(msg =>
            msg.id === streamMsgId
              ? {
                  ...msg,
                  toolCalls: (msg.toolCalls || []).map(tc =>
                    tc.tool === toolName && tc.status === 'calling'
                      ? { ...tc, status: 'done' as const, result }
                      : tc
                  )
                }
              : msg
          ));
        },
      );

      // Replace the stream placeholder with the final AI response (keep tool calls)
      setConversation(prev => prev.map(msg =>
        msg.id === streamMsgId
          ? { ...msg, role: 'assistant' as const, content: result.content }
          : msg
      ));

      // Update MCP history for context continuity
      setMcpHistory(prev => [
        ...prev,
        { role: 'user', content: query },
        { role: 'assistant', content: result.content },
      ]);
    } catch (err: any) {
      setConversation(prev => prev.filter(msg => msg.id !== streamMsgId));
      setError(err.message || 'Failed to connect to intelligence service.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page)] p-4 md:p-8 animate-pgIn">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-1.5 glass-card rounded-xl text-[var(--p)] !border-[var(--p-line)]">
                <img src="/avatars.png" alt="Zira" className="w-9 h-9 rounded-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--p)] to-[#9f8ef1]">
                  Zira Intelligence <span className="text-[10px] bg-[var(--p-dim)] text-[var(--p)] border border-[var(--p-line)] rounded-full px-2 py-0.5 font-semibold tracking-wider ml-1">MCP</span>
                </h1>
                <p className="text-[11px] text-[var(--t4)] font-medium">Model Context Protocol · Live data access</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--p)] bg-[var(--p-dim)] border border-[var(--p-line)] rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 bg-[var(--green)] rounded-full animate-pulse" />
              MCP Connected
            </span>
          </div>
        </motion.div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Employees', value: employeeCount.toLocaleString(), icon: Users, color: 'var(--p)' },
            { label: 'Active Staff', value: activeCount.toLocaleString(), icon: Activity, color: 'var(--green)' },
            { label: 'MCP Tools', value: '7', icon: Wrench, color: '#9f8ef1' },
          ].map((stat) => (
            <motion.div key={stat.label} whileHover={{ y: -3 }} className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: `color-mix(in srgb, ${stat.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${stat.color} 25%, transparent)` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-[18px] font-bold text-[var(--t1)]">{stat.value}</p>
                <p className="text-[10px] text-[var(--t4)] font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chat Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 thin-scrollbar bg-[var(--sidebar)]/20">
            <AnimatePresence>
              {conversation.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Tool-stream / assistant messages */}
                  {(msg.role === 'assistant' || msg.role === 'tool-stream') && (
                    <div className="flex flex-col gap-2 max-w-[85%]">
                      {/* Tool Call Indicators */}
                      {msg.toolCalls && msg.toolCalls.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          {msg.toolCalls.map((tc, i) => (
                            <ToolCallIndicator key={i} toolName={tc.tool} status={tc.status} result={tc.result} />
                          ))}
                        </div>
                      )}
                      {/* Content */}
                      {msg.content && (
                        <div className="bg-[var(--glass)] border border-[var(--p-line)] rounded-2xl rounded-tl-none p-5 text-[var(--t2)] text-[13px] leading-relaxed">
                          <div className="flex items-center gap-2 mb-3 opacity-70">
                            <img src="/avatars.png" alt="Zira" className="w-5 h-5 rounded-full" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--p)]">Zira · MCP</span>
                          </div>
                          <div className="ai-response-content" dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.content) }} />
                        </div>
                      )}
                    </div>
                  )}
                  {/* User messages */}
                  {msg.role === 'user' && (
                    <div className="max-w-[75%] bg-[var(--p)] text-[var(--sidebar)] rounded-2xl rounded-br-none px-5 py-3.5 text-[13px] font-medium">
                      <div className="flex items-center gap-2 mb-2 opacity-70">
                        <User className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">You</span>
                      </div>
                      {msg.content}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && conversation[conversation.length - 1]?.role !== 'tool-stream' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--glass)] border border-[var(--p-line)] text-[11px] text-[var(--t3)]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--p)]" />
                    Connecting to MCP tools...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggested Prompts (show when empty) */}
          {conversation.length <= 1 && (
            <div className="px-6 pb-2">
              <p className="text-[10px] text-[var(--t4)] font-semibold uppercase tracking-wider mb-2">Suggested</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSubmit(undefined, p)}
                    className="flex items-center gap-1.5 text-[11px] text-[var(--t2)] bg-[var(--glass)] border border-[var(--p-line)] rounded-full px-3 py-1.5 hover:border-[var(--p)] hover:text-[var(--p)] transition-all"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-[var(--p-line)] bg-[var(--sidebar)]/50">
            {error && (
              <div className="mb-3 bg-[var(--red-d)] text-[var(--red)] px-4 py-2.5 rounded-lg text-[11px] font-semibold border border-[var(--red-glow)]">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-[var(--glass)] border border-[var(--p-line)] rounded-xl px-5 py-3 text-[13px] text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-[var(--p)] transition-all"
                placeholder="Ask Zira anything about your workforce..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="px-6 bg-[var(--p)] text-[var(--sidebar)] rounded-xl font-semibold text-[13px] hover:shadow-[0_0_20px_var(--p-dim)] transition-all disabled:opacity-30 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </motion.div>

      </div>

      <style>{`
        .ai-response-content h1, .ai-response-content h2, .ai-response-content h3 { margin: 0.75rem 0 0.4rem; }
        .ai-response-content ul { margin: 0.5rem 0; padding: 0; }
        .ai-response-content li { margin-bottom: 0.4rem; }
        .ai-response-content strong { color: var(--p); font-weight: 600; }
        .ai-response-content code { font-family: monospace; }
        .ai-response-content br { display: block; margin: 0.4rem 0; content: ''; }
      `}</style>
    </div>
  );
};