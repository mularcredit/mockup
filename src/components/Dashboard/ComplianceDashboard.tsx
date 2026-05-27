import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, ChevronRight, Shield, FileText } from 'lucide-react';
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import KPIStrip from './KPIStrip';

const complianceModules = [
  { name: 'PAYE', score: 100, status: 'compliant', filed: 'Jul 9', due: 'Aug 9' },
  { name: 'NSSF', score: 100, status: 'compliant', filed: 'Jul 9', due: 'Aug 9' },
  { name: 'SHA', score: 72, status: 'partial', filed: '—', due: 'Aug 9' },
  { name: 'Housing Levy', score: 100, status: 'compliant', filed: 'Jul 9', due: 'Aug 9' },
  { name: 'NITA Levy', score: 100, status: 'compliant', filed: 'Jul 15', due: 'Aug 15' },
  { name: 'P9A / P10', score: 100, status: 'compliant', filed: 'Mar 31', due: 'Mar 2026' },
];

const auditLog = [
  { act: 'PAYE July 2025 filed via iTax', user: 'Payroll Admin', time: '2 days ago', type: 'success' },
  { act: 'NSSF remittance submitted', user: 'Payroll Admin', time: '2 days ago', type: 'success' },
  { act: 'SHA number missing — 4 employees', user: 'System', time: '3 days ago', type: 'warning' },
  { act: 'Employee P9A bulk generated', user: 'HR Admin', time: '1 week ago', type: 'info' },
  { act: 'KRA PIN update — 2 employees', user: 'HR Admin', time: '1 week ago', type: 'success' },
  { act: 'Payroll audit log exported', user: 'Finance Manager', time: '2 weeks ago', type: 'info' },
];

const policyStatus = [
  { policy: 'Leave Policy', version: 'v3.1', lastReview: 'Jan 2025', status: 'current' },
  { policy: 'Data Protection Policy', version: 'v2.0', lastReview: 'Mar 2025', status: 'current' },
  { policy: 'AML/KYC Policy', version: 'v4.2', lastReview: 'Jun 2025', status: 'current' },
  { policy: 'Code of Conduct', version: 'v1.8', lastReview: 'Oct 2024', status: 'review-due' },
  { policy: 'Health & Safety Policy', version: 'v1.2', lastReview: 'Aug 2023', status: 'overdue' },
];

const missingDocs = [
  { item: 'SHA Registration Numbers', count: 4, severity: 'high' },
  { item: 'KRA PINs Missing', count: 2, severity: 'high' },
  { item: 'Bank Account Details', count: 1, severity: 'medium' },
  { item: 'Next-of-Kin Forms', count: 14, severity: 'low' },
  { item: 'Medical Insurance Cards', count: 7, severity: 'medium' },
];

const filingHistory = [
  { month: 'Jan', paye: 1, nssf: 1, sha: 1 },
  { month: 'Feb', paye: 1, nssf: 1, sha: 1 },
  { month: 'Mar', paye: 1, nssf: 1, sha: 0 },
  { month: 'Apr', paye: 1, nssf: 1, sha: 1 },
  { month: 'May', paye: 1, nssf: 1, sha: 1 },
  { month: 'Jun', paye: 1, nssf: 1, sha: 0 },
  { month: 'Jul', paye: 1, nssf: 1, sha: 0 },
];

const overallScore = 94;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--sidebar)] border border-[var(--p-line)] p-2.5 rounded-lg shadow-xl text-[10px]">
      <p className="font-mono text-[var(--t4)] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>{p.name}: {p.value === 1 ? 'Filed' : 'Missing'}</p>
      ))}
    </div>
  );
};

export default function ComplianceDashboard() {
  return (
    <div className="w-full animate-pgIn">
      <KPIStrip columns={6} items={[
        { label: 'Overall Compliance Score', value: `${overallScore}%`, trend: '→ 2 pending filings', trendType: 'up' },
        { label: 'PAYE Status', value: 'Filed ✓', trend: 'iTax — July 2025', trendType: 'up' },
        { label: 'NSSF Status', value: 'Filed ✓', trend: 'Tier I & II — July 2025', trendType: 'up' },
        { label: 'SHA Status', value: 'Partial', trend: '→ 4 employees missing PIN', trendType: 'warn' },
        { label: 'Pending Filings', value: '2', trend: 'SHA + Housing Levy', trendType: 'warn' },
        { label: 'Policy Reviews Due', value: '2', trend: '→ 1 overdue', trendType: 'warn' },
      ]} />

      {/* Row 1: Overall Score + Module Status + Filing History */}
      <div className="grid grid-cols-12 gap-3 mb-7">
        {/* Overall Score Gauge */}
        <div className="glass-card col-span-12 lg:col-span-3 p-5 flex flex-col items-center justify-center">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-4 self-start">Compliance Health</div>
          <div className="relative w-36 h-36 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" startAngle={220} endAngle={-40}
                data={[{ value: overallScore, fill: overallScore >= 90 ? '#00F59B' : overallScore >= 70 ? '#FFB300' : '#FF4D4D' }]}>
                <RadialBar background={{ fill: 'var(--glass)' }} dataKey="value" cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[28px] font-bold text-[var(--green)]">{overallScore}%</div>
              <div className="text-[9px] text-[var(--t4)]">Compliance</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 w-full">
            {[
              { label: 'Compliant', val: '5', col: 'var(--green)' },
              { label: 'Partial', val: '1', col: 'var(--amber)' },
              { label: 'Missed', val: '0', col: 'var(--red)' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-[var(--glass)] rounded-lg p-2">
                <div className="text-[16px] font-bold" style={{ color: s.col }}>{s.val}</div>
                <div className="text-[8px] text-[var(--t4)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Module-by-Module Status */}
        <div className="glass-card col-span-12 lg:col-span-5 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)]">
            <div className="text-[12px] font-medium text-[var(--t1)]">Statutory Filing Status</div>
            <div className="text-[10px] text-[var(--t3)] mt-0.5">Current compliance per obligation</div>
          </div>
          <div className="p-3">
            {complianceModules.map((m, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[var(--glass)]">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  m.status === 'compliant' ? 'bg-[var(--green)]/15' :
                  m.status === 'partial' ? 'bg-[var(--amber)]/15' : 'bg-[var(--red)]/15'
                }`}>
                  {m.status === 'compliant'
                    ? <CheckCircle className="w-3.5 h-3.5 text-[var(--green)]" />
                    : m.status === 'partial'
                      ? <AlertTriangle className="w-3.5 h-3.5 text-[var(--amber)]" />
                      : <XCircle className="w-3.5 h-3.5 text-[var(--red)]" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-[var(--t1)]">{m.name}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                      m.status === 'compliant' ? 'bg-[var(--green)]/15 text-[var(--green)]' :
                      m.status === 'partial' ? 'bg-[var(--amber)]/15 text-[var(--amber)]' :
                      'bg-[var(--red)]/15 text-[var(--red)]'
                    }`}>{m.status}</span>
                  </div>
                  <div className="text-[9px] text-[var(--t4)]">Filed: {m.filed} · Due: {m.due}</div>
                </div>
                <div className="text-[12px] font-bold" style={{
                  color: m.score === 100 ? 'var(--green)' : m.score >= 70 ? 'var(--amber)' : 'var(--red)'
                }}>{m.score}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filing History Chart */}
        <div className="glass-card col-span-12 lg:col-span-4 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Filing History (2025)</div>
          <div className="text-[10px] text-[var(--t3)] mb-2">Monthly statutory submissions</div>
          <div className="flex gap-3 mb-3">
            {[['#00E5FF','PAYE'],['#00F59B','NSSF'],['#FFB300','SHA']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5 text-[9px] text-[var(--t3)]">
                <span className="w-2 h-2 rounded-sm" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={filingHistory} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass)" vertical={false} opacity={0.4} />
              <XAxis dataKey="month" stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} hide />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--glass)' }} />
              <Bar dataKey="paye" fill="#00E5FF" name="PAYE" radius={[2,2,0,0]} barSize={8} />
              <Bar dataKey="nssf" fill="#00F59B" name="NSSF" radius={[2,2,0,0]} barSize={8} />
              <Bar dataKey="sha" fill="#FFB300" name="SHA" radius={[2,2,0,0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-[var(--p-line)]">
            <div className="text-[9px] text-[var(--t4)] mb-2 font-semibold uppercase tracking-wider">Key Tax Dates</div>
            {[
              { label: 'PAYE/NSSF/SHA — Aug 9th', urgent: false },
              { label: 'NITA Levy — Aug 15th', urgent: false },
              { label: 'Annual Return (KRA) — Jun 30th', urgent: true },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <Clock className={`w-3 h-3 ${d.urgent ? 'text-[var(--red)]' : 'text-[var(--t4)]'}`} />
                <span className={`text-[9.5px] ${d.urgent ? 'text-[var(--amber)]' : 'text-[var(--t3)]'}`}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Audit Log + Policy Status + Missing Docs */}
      <div className="grid grid-cols-12 gap-3">
        {/* Audit Log */}
        <div className="glass-card col-span-12 lg:col-span-5 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)]">
            <div className="text-[12px] font-medium text-[var(--t1)]">Compliance Audit Trail</div>
            <div className="text-[10px] text-[var(--t3)] mt-0.5">Recent compliance-related activity</div>
          </div>
          <div className="p-3">
            {auditLog.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[var(--glass)]">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  a.type === 'success' ? 'bg-[var(--green)]' :
                  a.type === 'warning' ? 'bg-[var(--amber)]' : 'bg-[#00E5FF]'
                }`} />
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-[var(--t1)]">{a.act}</div>
                  <div className="text-[9px] text-[var(--t4)]">{a.user}</div>
                </div>
                <div className="text-[9px] text-[var(--t4)] whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Review Status */}
        <div className="glass-card col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)]">
            <div className="text-[12px] font-medium text-[var(--t1)]">Policy Review Status</div>
            <div className="text-[10px] text-[var(--t3)] mt-0.5">Active HR & compliance policies</div>
          </div>
          <div className="p-3">
            {policyStatus.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[var(--glass)]">
                <FileText className={`w-4 h-4 shrink-0 ${
                  p.status === 'current' ? 'text-[var(--green)]' :
                  p.status === 'review-due' ? 'text-[var(--amber)]' : 'text-[var(--red)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-[var(--t1)] truncate">{p.policy}</div>
                  <div className="text-[9px] text-[var(--t4)]">{p.version} · Last review: {p.lastReview}</div>
                </div>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase whitespace-nowrap ${
                  p.status === 'current' ? 'bg-[var(--green)]/15 text-[var(--green)]' :
                  p.status === 'review-due' ? 'bg-[var(--amber)]/15 text-[var(--amber)]' :
                  'bg-[var(--red)]/15 text-[var(--red)]'
                }`}>{p.status === 'review-due' ? 'Review Due' : p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Documentation */}
        <div className="glass-card col-span-12 lg:col-span-3 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Missing Documentation</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Employee compliance document gaps</div>
          {missingDocs.map((d, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-[var(--glass)]">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  d.severity === 'high' ? 'bg-[var(--red)]' :
                  d.severity === 'medium' ? 'bg-[var(--amber)]' : 'bg-[#00E5FF]'
                }`} />
                <span className="text-[10.5px] text-[var(--t2)]">{d.item}</span>
              </div>
              <span className={`text-[14px] font-bold ${
                d.severity === 'high' ? 'text-[var(--red)]' :
                d.severity === 'medium' ? 'text-[var(--amber)]' : 'text-[#00E5FF]'
              }`}>{d.count}</span>
            </div>
          ))}
          <div className="mt-4 p-3 rounded-xl bg-[var(--green)]/10 border border-[var(--green)]/20">
            <div className="text-[11px] font-semibold text-[var(--green)]">Overall Risk Level</div>
            <div className="text-[18px] font-bold text-[var(--green)] mt-0.5">LOW</div>
            <div className="text-[9px] text-[var(--t3)] mt-0.5">2 high-priority items need attention</div>
          </div>
        </div>
      </div>
    </div>
  );
}
