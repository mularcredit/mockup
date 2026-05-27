import React from 'react';
import { Calendar, FileText, Target, BookOpen, Bell, ChevronRight, Clock, CheckCircle, Circle, Download, Send } from 'lucide-react';

const leaveBalances = [
  { type: 'Annual Leave', used: 7, total: 21, color: '#00E5FF' },
  { type: 'Sick Leave', used: 2, total: 14, color: '#00F59B' },
  { type: 'Compassionate', used: 0, total: 3, color: '#FFB300' },
  { type: 'Maternity/Paternity', used: 0, total: 90, color: 'var(--p)' },
];

const recentPayslips = [
  { month: 'July 2025', gross: 'KES 78,400', net: 'KES 63,200', status: 'available' },
  { month: 'June 2025', gross: 'KES 78,400', net: 'KES 63,200', status: 'available' },
  { month: 'May 2025', gross: 'KES 75,000', net: 'KES 60,800', status: 'available' },
];

const myGoals = [
  { goal: 'Q3 Loan Portfolio Target', pct: 78, due: 'Sep 30', color: '#00E5FF' },
  { goal: 'Client Visits (Monthly)', pct: 91, due: 'Jul 31', color: '#00F59B' },
  { goal: 'Training Hours Completed', pct: 55, due: 'Dec 31', color: '#FFB300' },
];

const myTraining = [
  { course: 'Credit Risk Assessment', pct: 100, status: 'completed', hours: 8 },
  { course: 'Customer Service Excellence', pct: 60, status: 'in-progress', hours: 4 },
  { course: 'AML/KYC Compliance', pct: 0, status: 'not-started', hours: 6 },
  { course: 'Data Protection & Privacy', pct: 0, status: 'not-started', hours: 3 },
];

const announcements = [
  { title: 'Payroll Processed — July 2025', time: '2 hours ago', type: 'payroll' },
  { title: 'Q3 Performance Reviews Begin Aug 1st', time: 'Yesterday', type: 'performance' },
  { title: 'New Leave Policy — Effective August', time: '3 days ago', type: 'policy' },
  { title: 'Team Building: Fri 1st Aug, 2pm', time: '4 days ago', type: 'event' },
];

const leaveHistory = [
  { type: 'Annual Leave', dates: 'Jun 14–16', days: 3, status: 'approved' },
  { type: 'Sick Leave', dates: 'May 22–23', days: 2, status: 'approved' },
  { type: 'Annual Leave', dates: 'Apr 4–5', days: 2, status: 'approved' },
];

const typeColor: Record<string, string> = {
  payroll: '#00F59B', performance: '#00E5FF', policy: '#FFB300', event: 'var(--p)'
};

export default function ESSDashboard() {
  return (
    <div className="w-full animate-pgIn">
      {/* Welcome Banner */}
      <div className="mb-5 px-5 py-4 rounded-xl border border-[#00E5FF]/20 bg-gradient-to-r from-[#00E5FF]/8 via-transparent to-[var(--p)]/8 flex items-center justify-between">
        <div>
          <div className="text-[18px] font-bold text-[var(--t1)]">Good morning 👋</div>
          <div className="text-[11px] text-[var(--t3)] mt-0.5">Here's your workspace for today — <span className="text-[var(--t2)] font-medium">Tuesday, 27 May 2025</span></div>
        </div>
        <div className="flex gap-2">
          {[
            { label: 'Apply Leave', icon: Calendar, col: '#00E5FF' },
            { label: 'My Payslip', icon: Download, col: '#00F59B' },
            { label: 'My Goals', icon: Target, col: '#FFB300' },
            { label: 'Request Advance', icon: Send, col: 'var(--p)' },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <button key={i} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-[var(--glass)] border border-[var(--p-line)] hover:border-[var(--t4)] transition-colors">
                <Icon className="w-4 h-4" style={{ color: a.col }} />
                <span className="text-[8.5px] text-[var(--t3)] whitespace-nowrap">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leave Balance Tiles */}
      <div className="grid grid-cols-4 gap-3 mb-7">
        {leaveBalances.map((l, i) => {
          const remaining = l.total - l.used;
          const pct = Math.round((remaining / l.total) * 100);
          return (
            <div key={i} className="glass-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider leading-tight">{l.type}</div>
                <div className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--glass)]" style={{ color: l.color }}>
                  {pct}%
                </div>
              </div>
              <div className="text-[24px] font-bold leading-none mb-0.5" style={{ color: l.color }}>{remaining}</div>
              <div className="text-[9px] text-[var(--t4)] mb-3">days remaining of {l.total}</div>
              <div className="h-1.5 bg-[var(--glass)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: l.color }} />
              </div>
              <div className="text-[9px] text-[var(--t4)] mt-1.5">{l.used} days used</div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Payslips + Goals + Leave History */}
      <div className="grid grid-cols-12 gap-3 mb-7">
        {/* Recent Payslips */}
        <div className="glass-card col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)]">
            <div className="text-[12px] font-medium text-[var(--t1)]">My Payslips</div>
            <div className="text-[10px] text-[var(--t3)] mt-0.5">Recent salary statements</div>
          </div>
          <div className="p-3 flex-1">
            {recentPayslips.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-[var(--glass)]">
                <div className="w-9 h-9 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#00E5FF]" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-[var(--t1)]">{p.month}</div>
                  <div className="text-[9px] text-[var(--t3)]">Gross: {p.gross} · Net: {p.net}</div>
                </div>
                <button className="p-1.5 rounded-lg bg-[var(--glass)] hover:bg-[#00E5FF]/10 transition-colors">
                  <Download className="w-3.5 h-3.5 text-[var(--t3)]" />
                </button>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[var(--p-line)]">
            <button className="w-full text-[10px] text-[#00E5FF] font-medium flex items-center justify-center gap-1 hover:underline">
              View all payslips <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* My Goals */}
        <div className="glass-card col-span-12 lg:col-span-4 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">My Goals & KPIs</div>
          <div className="text-[10px] text-[var(--t3)] mb-5">Current quarter performance targets</div>
          {myGoals.map((g, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-[var(--t2)]">{g.goal}</span>
                <span className="text-[11px] font-bold" style={{ color: g.color }}>{g.pct}%</span>
              </div>
              <div className="h-2 bg-[var(--glass)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.color }} />
              </div>
              <div className="text-[9px] text-[var(--t4)] mt-1">Due: {g.due}</div>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-[var(--p-line)] flex gap-2">
            <div className="flex-1 text-center bg-[var(--glass)] rounded-lg p-2">
              <div className="text-[16px] font-bold text-[var(--green)]">2/3</div>
              <div className="text-[8.5px] text-[var(--t4)]">On Track</div>
            </div>
            <div className="flex-1 text-center bg-[var(--glass)] rounded-lg p-2">
              <div className="text-[16px] font-bold text-[var(--amber)]">75%</div>
              <div className="text-[8.5px] text-[var(--t4)]">Avg KPI</div>
            </div>
          </div>
        </div>

        {/* Leave History */}
        <div className="glass-card col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)]">
            <div className="text-[12px] font-medium text-[var(--t1)]">My Leave History</div>
            <div className="text-[10px] text-[var(--t3)] mt-0.5">Recent leave applications</div>
          </div>
          <div className="p-3">
            {leaveHistory.map((l, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-[var(--glass)]">
                <div className="w-2 h-2 rounded-full bg-[var(--green)] shrink-0" />
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-[var(--t1)]">{l.type}</div>
                  <div className="text-[9px] text-[var(--t3)]">{l.dates} · {l.days} days</div>
                </div>
                <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--green)]/15 text-[var(--green)]">
                  {l.status}
                </span>
              </div>
            ))}
            <button className="mt-3 w-full px-3 py-2 rounded-lg border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-semibold hover:bg-[#00E5FF]/10 transition-colors">
              + Apply for Leave
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Training + Announcements */}
      <div className="grid grid-cols-12 gap-3">
        {/* My Training */}
        <div className="glass-card col-span-12 lg:col-span-7 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">My Learning & Development</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Assigned courses and completion status</div>
          <div className="grid grid-cols-1 gap-3">
            {myTraining.map((t, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--glass)] border border-[var(--p-line)] hover:border-[var(--t4)] transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  t.status === 'completed' ? 'bg-[var(--green)]/15' :
                  t.status === 'in-progress' ? 'bg-[#00E5FF]/15' : 'bg-[var(--glass)]'
                }`}>
                  {t.status === 'completed'
                    ? <CheckCircle className="w-4 h-4 text-[var(--green)]" />
                    : t.status === 'in-progress'
                      ? <Clock className="w-4 h-4 text-[#00E5FF]" />
                      : <Circle className="w-4 h-4 text-[var(--t4)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-[var(--t1)] truncate">{t.course}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-[var(--p-line)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${t.pct}%`,
                        background: t.status === 'completed' ? 'var(--green)' : t.status === 'in-progress' ? '#00E5FF' : 'var(--t4)'
                      }} />
                    </div>
                    <span className="text-[9px] text-[var(--t4)]">{t.pct}%</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-[var(--t3)]">{t.hours} hrs</div>
                  <div className={`text-[8px] font-bold mt-0.5 ${
                    t.status === 'completed' ? 'text-[var(--green)]' :
                    t.status === 'in-progress' ? 'text-[#00E5FF]' : 'text-[var(--t4)]'
                  }`}>{t.status === 'completed' ? 'Done' : t.status === 'in-progress' ? 'In Progress' : 'Not Started'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="glass-card col-span-12 lg:col-span-5 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--t3)]" />
            <div>
              <div className="text-[12px] font-medium text-[var(--t1)]">Company Announcements</div>
              <div className="text-[10px] text-[var(--t3)] mt-0.5">What's happening at work</div>
            </div>
          </div>
          <div className="p-3 flex-1">
            {announcements.map((a, i) => (
              <div key={i} className="flex gap-3 py-3 border-b border-[var(--glass)] cursor-pointer hover:bg-[var(--glass)] px-1 rounded transition-colors">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: typeColor[a.type] }} />
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-[var(--t1)] leading-snug">{a.title}</div>
                  <div className="text-[9px] text-[var(--t4)] mt-0.5">{a.time}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--t4)] mt-0.5 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
