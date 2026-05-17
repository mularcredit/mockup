import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────
// MCP TOOL DEFINITIONS
// ─────────────────────────────────────────────
export interface MCPTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required?: string[];
  };
}

export interface MCPToolResult {
  tool_name: string;
  result: any;
  error?: string;
}

export const MCP_TOOLS: MCPTool[] = [
  {
    name: 'get_employee_count',
    description: 'Get the total number of employees, optionally filtered by branch, town, department, or status.',
    parameters: {
      type: 'object',
      properties: {
        branch: { type: 'string', description: 'Filter by branch name (optional)' },
        town: { type: 'string', description: 'Filter by town name (optional)' },
        department: { type: 'string', description: 'Filter by department (optional)' },
        status: { type: 'string', description: 'Filter by employment status', enum: ['active', 'inactive', 'all'] },
      },
    },
  },
  {
    name: 'search_employees',
    description: 'Search and retrieve employee records based on specific criteria.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Partial or full employee name to search (optional)' },
        branch: { type: 'string', description: 'Filter by branch (optional)' },
        town: { type: 'string', description: 'Filter by town (optional)' },
        department: { type: 'string', description: 'Filter by department (optional)' },
        role: { type: 'string', description: 'Filter by job role or title (optional)' },
        limit: { type: 'string', description: 'Maximum number of results to return (default 10)' },
      },
    },
  },
  {
    name: 'get_department_breakdown',
    description: 'Get a breakdown of employee count grouped by department or branch.',
    parameters: {
      type: 'object',
      properties: {
        group_by: { type: 'string', description: 'Group results by this field', enum: ['Branch', 'Department', 'Town', 'Gender', 'Role'] },
        branch: { type: 'string', description: 'Filter to a specific branch (optional)' },
      },
      required: ['group_by'],
    },
  },
  {
    name: 'get_payroll_summary',
    description: 'Get payroll statistics including total gross pay, net pay, and deductions for a given period.',
    parameters: {
      type: 'object',
      properties: {
        period: { type: 'string', description: 'Pay period in YYYY-MM format (optional, defaults to latest)' },
        branch: { type: 'string', description: 'Filter by branch (optional)' },
      },
    },
  },
  {
    name: 'get_hr_alerts',
    description: 'Retrieve current HR alerts such as pending leave requests, contract renewals, or probation completions.',
    parameters: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Type of alert', enum: ['leave', 'contracts', 'probation', 'all'] },
      },
    },
  },
  {
    name: 'get_gender_distribution',
    description: 'Get the gender distribution of employees across the organization or a specific branch.',
    parameters: {
      type: 'object',
      properties: {
        branch: { type: 'string', description: 'Filter to a specific branch (optional)' },
      },
    },
  },
  {
    name: 'get_recent_hires',
    description: 'Get a list of recently hired employees within a given number of days.',
    parameters: {
      type: 'object',
      properties: {
        days: { type: 'string', description: 'Number of past days to look back (default 30)' },
        branch: { type: 'string', description: 'Filter by branch (optional)' },
      },
    },
  },
];

// ─────────────────────────────────────────────
// TOOL EXECUTION ENGINE
// ─────────────────────────────────────────────
export async function executeTool(name: string, args: Record<string, any>): Promise<MCPToolResult> {
  try {
    switch (name) {
      case 'get_employee_count': {
        let query = supabase.from('employees').select('id', { count: 'exact', head: true });
        if (args.branch && args.branch !== 'all') query = query.ilike('Branch', `%${args.branch}%`);
        if (args.town && args.town !== 'all') query = query.ilike('Town', `%${args.town}%`);
        if (args.department && args.department !== 'all') query = query.ilike('Department', `%${args.department}%`);
        if (args.status && args.status !== 'all') query = query.eq('status', args.status);
        const { count, error } = await query;
        if (error) throw error;
        return { tool_name: name, result: { count, filters: args } };
      }

      case 'search_employees': {
        const limit = parseInt(args.limit) || 10;
        let query = supabase.from('employees').select(
          '"First Name", "Last Name", "Middle Name", Branch, Town, Department, "Job Title", status, "Mobile Number"'
        ).limit(limit);
        if (args.name) query = query.or(`"First Name".ilike.%${args.name}%,"Last Name".ilike.%${args.name}%`);
        if (args.branch) query = query.ilike('Branch', `%${args.branch}%`);
        if (args.town) query = query.ilike('Town', `%${args.town}%`);
        if (args.department) query = query.ilike('Department', `%${args.department}%`);
        if (args.role) query = query.ilike('"Job Title"', `%${args.role}%`);
        const { data, error } = await query;
        if (error) throw error;
        return { tool_name: name, result: { employees: data, count: data?.length || 0 } };
      }

      case 'get_department_breakdown': {
        const groupBy = args.group_by || 'Branch';
        let query = supabase.from('employees').select(groupBy);
        if (args.branch) query = query.ilike('Branch', `%${args.branch}%`);
        const { data, error } = await query;
        if (error) throw error;
        const breakdown: Record<string, number> = {};
        data?.forEach((row: any) => {
          const key = row[groupBy] || 'Unknown';
          breakdown[key] = (breakdown[key] || 0) + 1;
        });
        const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
        return { tool_name: name, result: { group_by: groupBy, breakdown: Object.fromEntries(sorted), total: data?.length || 0 } };
      }

      case 'get_payroll_summary': {
        let query = supabase.from('payroll_records').select('gross_pay, net_pay, paye, nssf, nhif, housing_levy, total_deductions, pay_period');
        if (args.period) query = query.eq('pay_period', args.period);
        if (args.branch) query = query.ilike('branch', `%${args.branch}%`);
        query = query.order('pay_period', { ascending: false }).limit(500);
        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) return { tool_name: name, result: { message: 'No payroll records found for the specified period.' } };
        const summary = data.reduce((acc: any, rec: any) => ({
          gross_pay: acc.gross_pay + (rec.gross_pay || 0),
          net_pay: acc.net_pay + (rec.net_pay || 0),
          paye: acc.paye + (rec.paye || 0),
          nssf: acc.nssf + (rec.nssf || 0),
          nhif: acc.nhif + (rec.nhif || 0),
          housing_levy: acc.housing_levy + (rec.housing_levy || 0),
          total_deductions: acc.total_deductions + (rec.total_deductions || 0),
          record_count: acc.record_count + 1,
        }), { gross_pay: 0, net_pay: 0, paye: 0, nssf: 0, nhif: 0, housing_levy: 0, total_deductions: 0, record_count: 0 });
        const period = data[0]?.pay_period || args.period || 'latest';
        return { tool_name: name, result: { period, ...summary } };
      }

      case 'get_hr_alerts': {
        const alerts: any[] = [];
        if (args.type === 'leave' || args.type === 'all' || !args.type) {
          const { data } = await supabase.from('leave_requests').select('id, status, employee_name, leave_type').eq('status', 'pending').limit(10);
          if (data?.length) alerts.push({ category: 'Pending Leave Requests', count: data.length, items: data });
        }
        if (args.type === 'probation' || args.type === 'all' || !args.type) {
          const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);
          const { data } = await supabase.from('employees').select('"First Name", "Last Name", start_date, Branch').gte('start_date', thirtyDaysAgo.toISOString().split('T')[0]).limit(10);
          if (data?.length) alerts.push({ category: 'Employees Completing Probation Soon', count: data.length, items: data });
        }
        return { tool_name: name, result: { alerts, total_alerts: alerts.reduce((s, a) => s + a.count, 0) } };
      }

      case 'get_gender_distribution': {
        let query = supabase.from('employees').select('Gender');
        if (args.branch) query = query.ilike('Branch', `%${args.branch}%`);
        const { data, error } = await query;
        if (error) throw error;
        const dist: Record<string, number> = {};
        data?.forEach((row: any) => { const g = row.Gender || 'Not Specified'; dist[g] = (dist[g] || 0) + 1; });
        const total = data?.length || 0;
        const withPercentage = Object.fromEntries(Object.entries(dist).map(([k, v]) => [k, { count: v, percentage: ((v / total) * 100).toFixed(1) + '%' }]));
        return { tool_name: name, result: { distribution: withPercentage, total } };
      }

      case 'get_recent_hires': {
        const days = parseInt(args.days) || 30;
        const since = new Date(); since.setDate(since.getDate() - days);
        let query = supabase.from('employees').select('"First Name", "Last Name", Branch, Town, "Job Title", start_date').gte('start_date', since.toISOString().split('T')[0]).order('start_date', { ascending: false }).limit(20);
        if (args.branch) query = query.ilike('Branch', `%${args.branch}%`);
        const { data, error } = await query;
        if (error) throw error;
        return { tool_name: name, result: { recent_hires: data, count: data?.length || 0, since_date: since.toISOString().split('T')[0] } };
      }

      default:
        return { tool_name: name, result: null, error: `Unknown tool: ${name}` };
    }
  } catch (err: any) {
    return { tool_name: name, result: null, error: err.message || 'Tool execution failed' };
  }
}
