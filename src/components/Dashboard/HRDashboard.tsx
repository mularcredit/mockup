import React from 'react';
import { UserPlus, UserMinus, Users, ClipboardList, AlertTriangle, TrendingDown, ChevronRight, Clock, CheckCircle, Circle } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import KPIStrip from './KPIStrip';

const headcountData = [
  { dept: 'SALES', count: 145 }, { dept: 'CREDIT', count: 98 },
  { dept: 'OPS', count: 78 }, { dept: 'TECH', count: 45 },
  { dept: 'HR', count: 32 }, { dept: 'FINANCE', count: 28 },
  { dept: 'LEGAL', count: 14 },
];

const attritionData = [
  { month: 'Jan', rate: 2.1 }, { month: 'Feb', rate: 1.8 },
  { month: 'Mar', rate: 2.4 }, { month: 'Apr', rate: 1.9 },
  { month: 'May', rate: 2.8 }, { month: 'Jun', rate: 2.2 },
  { month: 'Jul', rate: 1.6 },
];

const demographics = [
  { name: 'Male', value: 64, color: '#00E5FF' },
  { name: 'Female', value: 36, color: 'var(--p)' },
];

const ageGroups = [
  { label: '20–29', value: 28, color: '#00E5FF' },
  { label: '30–39', value: 41, color: '#00F59B' },
  { label: '40–49', value: 22, color: '#FFB300' },
  { label: '50+', value: 9, color: '#FF4D4D' },
];

const expiringContracts = [
  { name: 'M. Kamau', dept: 'Credit', daysLeft: 4, type: 'Permanent' },
  { name: 'P. Otieno', dept: 'Sales', daysLeft: 8, type: 'Contract' },
  { name: 'A. Wanjiru', dept: 'Operations', daysLeft: 12, type: 'Probation' },
  { name: 'J. Kipchoge', dept: 'Finance', daysLeft: 21, type: 'Permanent' },
  { name: 'S. Mutuku', dept: 'HR', daysLeft: 27, type: 'Contract' },
];

const workforceMovement = [
  { act: 'Promoted', name: 'D. Oduya → Senior Credit Officer', date: '2 days ago', color: 'var(--green)' },
  { act: 'Transferred', name: 'W. Kariuki → Nakuru Branch', date: '4 days ago', color: '#00E5FF' },
  { act: 'Confirmed', name: 'B. Njeri — Probation Complete', date: 'Today', color: 'var(--p)' },
  { act: 'Resigned', name: 'T. Macharia — Finance Dept', date: 'Yesterday', color: 'var(--red)' },
  { act: 'Onboarding', name: 'R. Adhiambo — Starts Monday', date: 'Pending', color: 'var(--amber)' },
];

const pendingActions = [
  { label: 'Onboarding checklists incomplete', count: 3, col: 'var(--amber)' },
  { label: 'Probation reviews overdue', count: 2, col: 'var(--red)' },
  { label: 'Confirmation letters pending', count: 5, col: 'var(--p)' },
  { label: 'Exit clearance pending', count: 1, col: 'var(--red)' },
  { label: 'Document collection gaps', count: 8, col: 'var(--amber)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--sidebar)] border border-[var(--p-line)] p-2.5 rounded-lg shadow-xl text-[10px]">
      <p className="font-mono text-[var(--t4)] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function HRDashboard() {
  return (
    <div className="w-full animate-pgIn">
      <KPIStrip columns={6} items={[
        { label: 'Active Employees', value: '678', trend: '+6 new hires this month', trendType: 'up' },
        { label: 'New Hires (MTD)', value: '6', trend: '3 onboarding in progress', trendType: 'up' },
        { label: 'Exits (MTD)', value: '2', trend: '1 resignation, 1 termination', trendType: 'dn' },
        { label: 'Pending Onboarding', value: '3', trend: '→ Checklists incomplete', trendType: 'warn' },
        { label: 'Attrition Rate', value: '1.6%', trend: 'Rolling 12-month avg', trendType: 'up' },
        { label: 'Open Disciplinary', value: '4', trend: '2 require immediate action', trendType: 'warn' },
      ]} />

      {/* Row 1: Headcount + Attrition + Demographics */}
      <div className="grid grid-cols-12 gap-3 mb-7">
        {/* Headcount by Department */}
        <div className="glass-card col-span-12 lg:col-span-5 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Headcount by Department</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Current active employees per department</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={headcountData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass)" vertical={false} opacity={0.4} />
              <XAxis dataKey="dept" stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--glass)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                {headcountData.map((_, i) => (
                  <Cell key={i} fill={['#00E5FF','var(--p)','#00F59B','#FFB300','#FF4D4D','#00E5FF','var(--p)'][i % 7]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attrition Trend */}
        <div className="glass-card col-span-12 lg:col-span-4 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Attrition Rate Trend</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Monthly attrition % over last 7 months</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={attritionData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass)" vertical={false} opacity={0.4} />
              <XAxis dataKey="month" stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} domain={[0, 4]} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rate" stroke="#00E5FF" strokeWidth={2} dot={{ fill: '#00E5FF', r: 3 }} name="Attrition %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Demographics */}
        <div className="glass-card col-span-12 lg:col-span-3 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Workforce Demographics</div>
          <div className="text-[10px] text-[var(--t3)] mb-3">Gender & age distribution</div>
          <div className="flex items-center justify-center mb-3">
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={demographics} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" paddingAngle={3}>
                  {demographics.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            {demographics.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-[10px] text-[var(--t2)]">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--p-line)] pt-3">
            <div className="text-[9px] text-[var(--t4)] font-semibold uppercase tracking-wider mb-2">Age Groups</div>
            {ageGroups.map(g => (
              <div key={g.label} className="flex items-center gap-2 mb-1.5">
                <div className="text-[9px] text-[var(--t3)] w-8">{g.label}</div>
                <div className="flex-1 h-1.5 bg-[var(--glass)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${g.value}%`, background: g.color }} />
                </div>
                <div className="text-[9px] text-[var(--t3)] w-6 text-right">{g.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Contract Expiry + Workforce Movement + Pending Actions */}
      <div className="grid grid-cols-12 gap-3 mb-7">
        {/* Contract Expiry Monitor */}
        <div className="glass-card col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)] flex justify-between items-center">
            <div>
              <div className="text-[12px] font-medium text-[var(--t1)]">Contract Expiry Monitor</div>
              <div className="text-[10px] text-[var(--t3)] mt-0.5">Upcoming renewals requiring action</div>
            </div>
            <span className="text-[9px] font-bold text-[var(--amber)] tracking-widest">12 TOTAL</span>
          </div>
          <div className="p-3 overflow-y-auto max-h-[220px] custom-scrollbar">
            {expiringContracts.map((c, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[var(--glass)]">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  c.daysLeft <= 7 ? 'bg-[var(--red)]/15 text-[var(--red)]' :
                  c.daysLeft <= 14 ? 'bg-[var(--amber)]/15 text-[var(--amber)]' :
                  'bg-[var(--glass)] text-[var(--t3)]'
                }`}>{c.daysLeft}d</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-[var(--t1)] truncate">{c.name}</div>
                  <div className="text-[9px] text-[var(--t4)]">{c.dept} · {c.type}</div>
                </div>
                <ChevronRight className="w-3 h-3 text-[var(--t4)]" />
              </div>
            ))}
          </div>
        </div>

        {/* Workforce Movement */}
        <div className="glass-card col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)]">
            <div className="text-[12px] font-medium text-[var(--t1)]">Workforce Movement</div>
            <div className="text-[10px] text-[var(--t3)] mt-0.5">Recent lifecycle events</div>
          </div>
          <div className="p-3 overflow-y-auto max-h-[220px] custom-scrollbar">
            {workforceMovement.map((m, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[var(--glass)]">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: m.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: m.color }}>{m.act}</div>
                  <div className="text-[11px] text-[var(--t1)] truncate">{m.name}</div>
                </div>
                <div className="text-[9px] text-[var(--t4)] whitespace-nowrap">{m.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending HR Actions */}
        <div className="glass-card col-span-12 lg:col-span-4 p-4">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Pending HR Actions</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Items blocking employee lifecycle</div>
          {pendingActions.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-[var(--glass)]">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.col }} />
                <span className="text-[11px] text-[var(--t2)]">{a.label}</span>
              </div>
              <span className="text-[14px] font-bold" style={{ color: a.col }}>{a.count}</span>
            </div>
          ))}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-[var(--green)]/10 border border-[var(--green)]/20 rounded-lg p-3 text-center">
              <div className="text-[18px] font-bold text-[var(--green)]">94%</div>
              <div className="text-[9px] text-[var(--t3)] mt-0.5">Profile Completeness</div>
            </div>
            <div className="flex-1 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-lg p-3 text-center">
              <div className="text-[18px] font-bold text-[#00E5FF]">100%</div>
              <div className="text-[9px] text-[var(--t3)] mt-0.5">Payroll Linked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
