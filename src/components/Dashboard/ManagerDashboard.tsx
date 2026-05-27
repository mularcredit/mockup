import React from 'react';
import { CheckCircle, Clock, ChevronRight, Users, Target, TrendingUp, Calendar } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import KPIStrip from './KPIStrip';

const weeklyAttendance = [
  { day: 'Mon', present: 23, absent: 2, late: 1 },
  { day: 'Tue', present: 24, absent: 1, late: 1 },
  { day: 'Wed', present: 22, absent: 3, late: 2 },
  { day: 'Thu', present: 25, absent: 0, late: 1 },
  { day: 'Fri', present: 21, absent: 3, late: 2 },
];

const teamPerformance = [
  { name: 'D. Oduya', kpi: 94, target: 100 },
  { name: 'W. Kariuki', kpi: 78, target: 100 },
  { name: 'B. Njeri', kpi: 88, target: 100 },
  { name: 'R. Adhiambo', kpi: 62, target: 100 },
  { name: 'T. Macharia', kpi: 91, target: 100 },
  { name: 'J. Kimani', kpi: 73, target: 100 },
];

const otTrend = [
  { week: 'W1', hours: 14 }, { week: 'W2', hours: 18 },
  { week: 'W3', hours: 22 }, { week: 'W4', hours: 16 },
];

const pendingApprovals = [
  { type: 'Leave', name: 'W. Kariuki', detail: 'Annual leave — 3 days', since: '2h ago', urgent: false },
  { type: 'Leave', name: 'B. Njeri', detail: 'Sick leave — today', since: '30m ago', urgent: true },
  { type: 'OT', name: 'D. Oduya', detail: '4hrs overtime claim', since: 'Yesterday', urgent: false },
  { type: 'Expense', name: 'R. Adhiambo', detail: 'Travel claim KES 2,400', since: '3 days ago', urgent: false },
  { type: 'Leave', name: 'J. Kimani', detail: 'Compassionate — 2 days', since: '1h ago', urgent: true },
];

const teamGoals = [
  { goal: 'Q3 Loan Disbursements', pct: 78, target: 'KES 48M', color: '#00E5FF' },
  { goal: 'Client Acquisition', pct: 91, target: '240 clients', color: '#00F59B' },
  { goal: 'Portfolio Quality (PAR)', pct: 64, target: '< 3% PAR30', color: '#FFB300' },
  { goal: 'Staff Training Hours', pct: 55, target: '120 hrs/quarter', color: 'var(--p)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--sidebar)] border border-[var(--p-line)] p-2.5 rounded-lg shadow-xl text-[10px]">
      <p className="font-mono text-[var(--t4)] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold" style={{ color: p.color ?? p.fill }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function ManagerDashboard() {
  return (
    <div className="w-full animate-pgIn">
      <KPIStrip columns={6} items={[
        { label: 'My Team Size', value: '26', trend: '2 on leave today', trendType: 'up' },
        { label: 'Present Today', value: '23', trend: '88.5% attendance rate', trendType: 'up' },
        { label: 'On Leave', value: '2', trend: '1 sick, 1 annual', trendType: 'up' },
        { label: 'Pending Approvals', value: '5', trend: '→ 2 urgent', trendType: 'warn' },
        { label: 'Team KPI Avg', value: '81%', trend: '↑ +4% from last month', trendType: 'up' },
        { label: 'OT This Week', value: '22 hrs', trend: 'Across 6 employees', trendType: 'warn' },
      ]} />

      {/* Row 1: Attendance + Performance + OT */}
      <div className="grid grid-cols-12 gap-3 mb-7">
        {/* Weekly Attendance */}
        <div className="glass-card col-span-12 lg:col-span-5 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Team Attendance This Week</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Present / Absent / Late breakdown</div>
          <div className="flex gap-3 mb-3">
            {[['#00F59B','Present'],['#FF4D4D','Absent'],['#FFB300','Late']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5 text-[9px] text-[var(--t3)]">
                <span className="w-2 h-2 rounded-sm" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyAttendance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass)" vertical={false} opacity={0.4} />
              <XAxis dataKey="day" stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--glass)' }} />
              <Bar dataKey="present" stackId="a" fill="#00F59B" name="Present" radius={[0,0,0,0]} />
              <Bar dataKey="absent" stackId="a" fill="#FF4D4D" name="Absent" />
              <Bar dataKey="late" stackId="a" fill="#FFB300" name="Late" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team KPI Performance */}
        <div className="glass-card col-span-12 lg:col-span-4 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Team KPI Performance</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Individual KPI completion vs target</div>
          {teamPerformance.map((m, i) => (
            <div key={i} className="flex items-center gap-3 mb-2.5">
              <div className="text-[10px] text-[var(--t3)] w-20 truncate">{m.name}</div>
              <div className="flex-1 h-2 bg-[var(--glass)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{
                  width: `${m.kpi}%`,
                  background: m.kpi >= 85 ? '#00F59B' : m.kpi >= 70 ? '#FFB300' : '#FF4D4D'
                }} />
              </div>
              <div className={`text-[10px] font-semibold w-8 text-right ${
                m.kpi >= 85 ? 'text-[var(--green)]' : m.kpi >= 70 ? 'text-[var(--amber)]' : 'text-[var(--red)]'
              }`}>{m.kpi}%</div>
            </div>
          ))}
        </div>

        {/* OT Trend + quick stats */}
        <div className="glass-card col-span-12 lg:col-span-3 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Overtime Trend</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Weekly OT hours (team total)</div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={otTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <XAxis dataKey="week" stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="hours" stroke="#FFB300" strokeWidth={2} dot={{ fill: '#FFB300', r: 3 }} name="OT Hrs" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 border-t border-[var(--p-line)] pt-3 grid grid-cols-2 gap-2">
            {[
              { label: 'Avg OT/person', val: '3.7 hrs', col: '#FFB300' },
              { label: 'OT Approved', val: '18 hrs', col: 'var(--green)' },
              { label: 'OT Pending', val: '4 hrs', col: 'var(--amber)' },
              { label: 'Top OT: D. Oduya', val: '7 hrs', col: '#00E5FF' },
            ].map((s, i) => (
              <div key={i} className="bg-[var(--glass)] rounded-lg p-2">
                <div className="text-[11px] font-bold" style={{ color: s.col }}>{s.val}</div>
                <div className="text-[8.5px] text-[var(--t4)] mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Pending Approvals + Team Goals */}
      <div className="grid grid-cols-12 gap-3">
        <div className="glass-card col-span-12 lg:col-span-5 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)] flex justify-between items-center">
            <div>
              <div className="text-[12px] font-medium text-[var(--t1)]">Pending Team Approvals</div>
              <div className="text-[10px] text-[var(--t3)] mt-0.5">Leave, OT & expense requests</div>
            </div>
            <span className="text-[9px] font-bold text-[var(--amber)]">5 PENDING</span>
          </div>
          <div className="p-3">
            {pendingApprovals.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[var(--glass)]">
                <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                  a.type === 'Leave' ? 'bg-[#00E5FF]/15 text-[#00E5FF]' :
                  a.type === 'OT' ? 'bg-[#FFB300]/15 text-[#FFB300]' :
                  'bg-[var(--p)]/15 text-[var(--p)]'
                }`}>{a.type}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-[var(--t1)]">{a.name}
                    {a.urgent && <span className="ml-1.5 text-[8px] font-bold text-[var(--red)] bg-[var(--red)]/10 px-1 rounded">URGENT</span>}
                  </div>
                  <div className="text-[10px] text-[var(--t3)]">{a.detail}</div>
                </div>
                <div className="text-[9px] text-[var(--t4)]">{a.since}</div>
                <button className="px-2 py-1 bg-[var(--green)]/15 text-[var(--green)] text-[9px] font-bold rounded hover:bg-[var(--green)]/25 transition-colors">
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card col-span-12 lg:col-span-7 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Team Goals Progress</div>
          <div className="text-[10px] text-[var(--t3)] mb-5">Q3 targets vs current achievement</div>
          {teamGoals.map((g, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] text-[var(--t2)]">{g.goal}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-[var(--t4)]">Target: {g.target}</span>
                  <span className="text-[12px] font-bold" style={{ color: g.color }}>{g.pct}%</span>
                </div>
              </div>
              <div className="h-2.5 bg-[var(--glass)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all relative overflow-hidden" style={{ width: `${g.pct}%`, background: g.color }}>
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-[var(--p-line)] grid grid-cols-3 gap-3">
            {[
              { label: 'Goals On Track', val: '2', col: 'var(--green)' },
              { label: 'At Risk', val: '1', col: 'var(--amber)' },
              { label: 'Behind Target', val: '1', col: 'var(--red)' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-[var(--glass)] rounded-xl p-3">
                <div className="text-[20px] font-bold" style={{ color: s.col }}>{s.val}</div>
                <div className="text-[9px] text-[var(--t3)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
