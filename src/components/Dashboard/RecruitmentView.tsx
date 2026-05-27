import React from 'react';
import { ChevronRight, Briefcase, UserCheck, Clock, TrendingUp, Users } from 'lucide-react';
import {
  FunnelChart, Funnel, LabelList, Cell,
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import KPIStrip from './KPIStrip';

const pipeline = [
  { stage: 'Applied', count: 148, fill: '#00E5FF' },
  { stage: 'Screening', count: 84, fill: '#00D4EE' },
  { stage: 'Interview 1', count: 52, fill: '#00C3DD' },
  { stage: 'Interview 2', count: 28, fill: '#00B2CC' },
  { stage: 'Assessment', count: 18, fill: 'var(--p)' },
  { stage: 'Offer', count: 9, fill: '#00F59B' },
  { stage: 'Hired', count: 6, fill: '#00D080' },
];

const openPositions = [
  { title: 'Credit Officer', dept: 'Credit', apps: 34, daysOpen: 18, urgency: 'high' },
  { title: 'Branch Manager', dept: 'Operations', apps: 12, daysOpen: 32, urgency: 'critical' },
  { title: 'IT Support Analyst', dept: 'Tech', apps: 21, daysOpen: 7, urgency: 'normal' },
  { title: 'Teller — Mombasa', dept: 'Banking', apps: 28, daysOpen: 14, urgency: 'high' },
  { title: 'HR Business Partner', dept: 'HR', apps: 9, daysOpen: 41, urgency: 'critical' },
  { title: 'Sales Executive', dept: 'Sales', apps: 44, daysOpen: 5, urgency: 'normal' },
];

const upcomingInterviews = [
  { name: 'A. Mutua', role: 'Credit Officer', time: 'Today 2:00 PM', type: 'Video', color: '#00E5FF' },
  { name: 'B. Kamau', role: 'Branch Manager', time: 'Today 4:30 PM', type: 'In-person', color: '#00F59B' },
  { name: 'C. Njeri', role: 'IT Analyst', time: 'Tomorrow 10:00 AM', type: 'Video', color: 'var(--p)' },
  { name: 'D. Otieno', role: 'Sales Executive', time: 'Tomorrow 2:00 PM', type: 'Phone', color: '#FFB300' },
];

const timeToHire = [
  { month: 'Jan', days: 28 }, { month: 'Feb', days: 24 }, { month: 'Mar', days: 31 },
  { month: 'Apr', days: 22 }, { month: 'May', days: 26 }, { month: 'Jun', days: 19 },
  { month: 'Jul', days: 21 },
];

const sourcingData = [
  { source: 'LinkedIn', pct: 38, hired: 3, color: '#00E5FF' },
  { source: 'Referrals', pct: 28, hired: 2, color: '#00F59B' },
  { source: 'Job Boards', pct: 22, hired: 1, color: '#FFB300' },
  { source: 'Walk-in', pct: 12, hired: 0, color: 'var(--p)' },
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

export default function RecruitmentView() {
  return (
    <div className="w-full animate-pgIn">
      <KPIStrip columns={6} items={[
        { label: 'Open Positions', value: '14', trend: '→ 5 delayed beyond SLA', trendType: 'warn' },
        { label: 'Total Applicants', value: '148', trend: 'Active pipeline this month', trendType: 'up' },
        { label: 'Interviews Today', value: '4', trend: '2 video, 1 in-person, 1 phone', trendType: 'up' },
        { label: 'Offers Pending', value: '9', trend: '→ 3 awaiting acceptance', trendType: 'warn' },
        { label: 'Hired (MTD)', value: '6', trend: 'vs 8 target', trendType: 'dn' },
        { label: 'Avg Time-to-Hire', value: '21 days', trend: '↓ 5 days faster than Q2', trendType: 'up' },
      ]} />

      {/* Row 1: Funnel + Open Positions */}
      <div className="grid grid-cols-12 gap-3 mb-7">
        {/* Recruitment Pipeline Funnel */}
        <div className="glass-card col-span-12 lg:col-span-4 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Recruitment Pipeline</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Candidates by stage — current cycle</div>
          {pipeline.map((s, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <div className="text-[9px] text-[var(--t3)] w-16 truncate">{s.stage}</div>
              <div className="flex-1 h-5 bg-[var(--glass)] rounded overflow-hidden relative">
                <div className="h-full rounded flex items-center pl-2 transition-all"
                  style={{ width: `${(s.count / 148) * 100}%`, background: s.fill, opacity: 0.8 }}>
                  <span className="text-[9px] font-bold text-[var(--sidebar)] whitespace-nowrap">{s.count}</span>
                </div>
              </div>
              <div className="text-[9px] text-[var(--t4)] w-8 text-right">
                {Math.round((s.count / 148) * 100)}%
              </div>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <div className="glass-card col-span-12 lg:col-span-8 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)] flex justify-between items-center">
            <div>
              <div className="text-[12px] font-medium text-[var(--t1)]">Open Positions</div>
              <div className="text-[10px] text-[var(--t3)] mt-0.5">Active vacancies & application status</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-semibold">
              + New Position
            </button>
          </div>
          <div className="p-3">
            {openPositions.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[var(--glass)]">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  p.urgency === 'critical' ? 'bg-[var(--red)] animate-pulse' :
                  p.urgency === 'high' ? 'bg-[var(--amber)]' : 'bg-[var(--green)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-[var(--t1)]">{p.title}</div>
                  <div className="text-[9px] text-[var(--t4)]">{p.dept} · Open {p.daysOpen} days</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[var(--t3)]">
                  <Users className="w-3 h-3" /> {p.apps}
                </div>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                  p.urgency === 'critical' ? 'bg-[var(--red)]/15 text-[var(--red)]' :
                  p.urgency === 'high' ? 'bg-[var(--amber)]/15 text-[var(--amber)]' :
                  'bg-[var(--green)]/15 text-[var(--green)]'
                }`}>{p.urgency}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--t4)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Time-to-Hire Trend + Upcoming Interviews + Sourcing */}
      <div className="grid grid-cols-12 gap-3">
        {/* Time-to-Hire trend */}
        <div className="glass-card col-span-12 lg:col-span-4 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Time-to-Hire Trend</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Average days from open to hire</div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={timeToHire} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass)" vertical={false} opacity={0.4} />
              <XAxis dataKey="month" stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="days" stroke="#00E5FF" strokeWidth={2} dot={{ fill: '#00E5FF', r: 3 }} name="Days" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-[var(--p-line)]">
            <div className="text-[9px] text-[var(--t4)] mb-2 font-semibold uppercase tracking-wider">Sourcing Channels</div>
            {sourcingData.map((s, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <div className="text-[10px] text-[var(--t3)] w-16">{s.source}</div>
                <div className="flex-1 h-1.5 bg-[var(--glass)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
                <div className="text-[9px] text-[var(--t4)] w-6 text-right">{s.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="glass-card col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)]">
            <div className="text-[12px] font-medium text-[var(--t1)]">Upcoming Interviews</div>
            <div className="text-[10px] text-[var(--t3)] mt-0.5">Today & tomorrow's schedule</div>
          </div>
          <div className="p-3 flex-1">
            {upcomingInterviews.map((iv, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-[var(--glass)]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--glass)]" style={{ border: `1px solid ${iv.color}33` }}>
                  <UserCheck className="w-4 h-4" style={{ color: iv.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-[var(--t1)]">{iv.name}</div>
                  <div className="text-[9px] text-[var(--t3)]">{iv.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-medium text-[var(--t2)]">{iv.time.split(' ').slice(0,2).join(' ')}</div>
                  <div className="text-[9px]" style={{ color: iv.color }}>{iv.type}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[var(--p-line)]">
            <button className="w-full text-[10px] text-[#00E5FF] font-medium flex items-center justify-center gap-1 hover:underline">
              Full interview calendar <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Hiring Stats */}
        <div className="glass-card col-span-12 lg:col-span-4 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-4">Hiring Performance</div>
          {[
            { label: 'Offer Acceptance Rate', val: '78%', sub: '7 of 9 offers accepted', col: '#00F59B' },
            { label: 'Interview-to-Offer', val: '32%', sub: '28 interviewed → 9 offers', col: '#00E5FF' },
            { label: 'Application-to-Interview', val: '35%', sub: '148 applied → 52 interviewed', col: 'var(--p)' },
            { label: 'Positions Filled MTD', val: '6 / 8', sub: '75% of monthly target', col: '#FFB300' },
            { label: 'Avg Cost-per-Hire', val: 'KES 12K', sub: 'Incl. sourcing & assessment', col: 'var(--t2)' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-[var(--glass)]">
              <div>
                <div className="text-[11px] text-[var(--t2)]">{s.label}</div>
                <div className="text-[9px] text-[var(--t4)]">{s.sub}</div>
              </div>
              <div className="text-[15px] font-bold" style={{ color: s.col }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
