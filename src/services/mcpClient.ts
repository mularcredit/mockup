import { MCP_TOOLS, MCPTool, MCPToolResult, executeTool } from './mcpServer';

const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions';

export interface MCPMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: MCPToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface MCPToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface MCPResponse {
  content: string;
  tool_calls_made: Array<{ tool: string; args: any; result: any }>;
}

// Build the system prompt for MCP mode
const buildSystemPrompt = (context: string) => `
You are Zira, an intelligent HR assistant powered by the Model Context Protocol (MCP).
You have access to a set of tools that can query live HR data from the organization's database.

RULES:
1. ALWAYS use tools to get real data before answering data-related questions.
2. Do NOT guess or make up numbers — only use what the tools return.
3. After getting tool results, provide a clear, professional, conversational summary.
4. If a user asks about employees, payroll, departments, or HR metrics, call the appropriate tool.
5. You may call multiple tools in sequence if needed.
6. Format your final response in clean markdown.

ORGANIZATION CONTEXT:
${context}
`;

// ─────────────────────────────────────────────
// MAIN MCP CLIENT - Agentic Tool-Call Loop
// ─────────────────────────────────────────────
export async function runMCPQuery(
  userMessage: string,
  history: MCPMessage[],
  context: string,
  onToolCall?: (toolName: string, args: any) => void,
  onToolResult?: (toolName: string, result: any) => void,
): Promise<MCPResponse> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DeepSeek API key not configured');

  const messages: MCPMessage[] = [
    { role: 'system', content: buildSystemPrompt(context) },
    ...history.filter(m => m.role !== 'system').slice(-10), // keep last 10 turns
    { role: 'user', content: userMessage },
  ];

  const toolCallsLog: Array<{ tool: string; args: any; result: any }> = [];
  const MAX_ITERATIONS = 5; // Prevent infinite loops

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const response = await fetch(DEEPSEEK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        tools: MCP_TOOLS.map(tool => ({
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          },
        })),
        tool_choice: 'auto',
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'API request failed');
    }

    const data = await response.json();
    const choice = data.choices[0];
    const assistantMessage = choice.message;

    // Add assistant's response to messages
    messages.push({
      role: 'assistant',
      content: assistantMessage.content || '',
      tool_calls: assistantMessage.tool_calls,
    });

    // If the model is done (no more tool calls), return the final response
    if (choice.finish_reason === 'stop' || !assistantMessage.tool_calls?.length) {
      return {
        content: assistantMessage.content || 'I was unable to generate a response.',
        tool_calls_made: toolCallsLog,
      };
    }

    // Execute each tool call in parallel
    const toolResults: MCPToolResult[] = await Promise.all(
      assistantMessage.tool_calls.map(async (tc: MCPToolCall) => {
        const args = JSON.parse(tc.function.arguments || '{}');
        onToolCall?.(tc.function.name, args);
        const result = await executeTool(tc.function.name, args);
        onToolResult?.(tc.function.name, result.result);
        toolCallsLog.push({ tool: tc.function.name, args, result: result.result });
        return result;
      })
    );

    // Feed tool results back into the message history
    for (let i = 0; i < assistantMessage.tool_calls.length; i++) {
      const tc = assistantMessage.tool_calls[i];
      const result = toolResults[i];
      messages.push({
        role: 'tool',
        content: JSON.stringify(result.error ? { error: result.error } : result.result),
        tool_call_id: tc.id,
        name: tc.function.name,
      });
    }
  }

  // If we hit the max iterations, return whatever the last content was
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  return {
    content: lastAssistant?.content || 'Analysis complete.',
    tool_calls_made: toolCallsLog,
  };
}
