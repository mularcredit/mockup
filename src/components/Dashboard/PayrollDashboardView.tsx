import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, ChevronRight, Banknote, CreditCard, Smartphone } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import KPIStrip from './KPIStrip';

const payrollTrend = [
  { month: 'Jan', gross: 118, net: 98, tax: 14 },
  { month: 'Feb', gross: 121, net: 100, tax: 15 },
  { month: 'Mar', gross: 119, net: 99, tax: 14 },
  { month: 'Apr', gross: 124, net: 103, tax: 15 },
  { month: 'May', gross: 128, net: 106, tax: 16 },
  { month: 'Jun', gross: 131, net: 108, tax: 16 },
  { month: 'Jul', gross: 134, net: 110, tax: 17 },
];

const costBreakdown = [
  { name: 'Base Salary', value: 82, color: '#00E5FF' },
  { name: 'Allowances', value: 9, color: '#00F59B' },
  { name: 'Overtime', value: 5, color: '#FFB300' },
  { name: 'Benefits', value: 4, color: 'var(--p)' },
];

const disbursementMethods = [
  { method: 'M-Pesa', count: 412, amount: 'KES 6.2M', pct: 61, color: '#00F59B' },
  { method: 'Bank EFT', count: 196, amount: 'KES 3.8M', pct: 34, color: '#00E5FF' },
  { method: 'Cheque', count: 28, amount: 'KES 0.4M', pct: 4, color: '#FFB300' },
  { method: 'Cash', count: 8, amount: 'KES 0.1M', pct: 1, color: 'var(--p)' },
];

const exceptions = [
  { name: 'K. Mutua', issue: 'Missing bank details', dept: 'Sales', severity: 'high' },
  { name: 'A. Odhiambo', issue: 'Duplicate entry detected', dept: 'Credit', severity: 'high' },
  { name: 'T. Wangari', issue: 'Salary structure mismatch', dept: 'HR', severity: 'medium' },
  { name: 'P. Njoroge', issue: 'SHA number unverified', dept: 'Ops', severity: 'medium' },
  { name: 'M. Otieno', issue: 'Advance balance pending', dept: 'Finance', severity: 'low' },
];

const statutory = [
  { label: 'PAYE', amount: 'KES 1.4M', status: 'ready', due: '9th Aug' },
  { label: 'NSSF', amount: 'KES 420K', status: 'ready', due: '9th Aug' },
  { label: 'SHA', amount: 'KES 341K', status: 'pending', due: '9th Aug' },
  { label: 'Housing Levy', amount: 'KES 186K', status: 'ready', due: '9th Aug' },
  { label: 'NITA', amount: 'KES 12K', status: 'ready', due: '15th Aug' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--sidebar)] border border-[var(--p-line)] p-2.5 rounded-lg shadow-xl text-[10px]">
      <p className="font-mono text-[var(--t4)] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>{p.name}: KES {p.value}M</p>
      ))}
    </div>
  );
};

export default function PayrollDashboardView() {
  return (
    <div className="w-full animate-pgIn">
      <KPIStrip columns={8} items={[
        { label: 'Gross Payroll', value: 'KES 13.4M', trend: '+2.3% from last month', trendType: 'up' },
        { label: 'Net Pay to Disburse', value: 'KES 11.0M', trend: 'Bank + M-Pesa + Cheque', trendType: 'up' },
        { label: 'PAYE Deducted', value: 'KES 1.4M', trend: '→ Ready for iTax', trendType: 'up' },
        { label: 'NSSF Deducted', value: 'KES 420K', trend: 'Tier I & II combined', trendType: 'up' },
        { label: 'SHA Deducted', value: 'KES 341K', trend: '2.75% applied', trendType: 'up' },
        { label: 'Housing Levy', value: 'KES 186K', trend: '→ Boma Yangu ready', trendType: 'up' },
        { label: 'Payroll Status', value: 'Locked', trend: 'Pending disbursement', trendType: 'warn' },
        { label: 'Exceptions', value: '5', trend: '→ 2 require action', trendType: 'warn' },
      ]} />

      {/* Row 1: Payroll Trend + Cost Breakdown */}
      <div className="grid grid-cols-12 gap-3 mb-7">
        <div className="glass-card col-span-12 lg:col-span-7 p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[12px] font-medium text-[var(--t1)]">Payroll Cost Trends</div>
              <div className="text-[10px] text-[var(--t3)] mt-0.5">Gross vs Net vs Tax — last 7 months (KES M)</div>
            </div>
            <div className="flex gap-3">
              {[['#00E5FF','Gross'],['#00F59B','Net'],['#FFB300','PAYE']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5 text-[9px] text-[var(--t3)]">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={payrollTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                {[['gGross','#00E5FF'],['gNet','#00F59B'],['gTax','#FFB300']].map(([id,col]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={col} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={col} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass)" vertical={false} opacity={0.4} />
              <XAxis dataKey="month" stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--t4)" fontSize={9} tickLine={false} axisLine={false} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="gross" stroke="#00E5FF" fill="url(#gGross)" strokeWidth={1.5} name="Gross" />
              <Area type="monotone" dataKey="net" stroke="#00F59B" fill="url(#gNet)" strokeWidth={1.5} name="Net" />
              <Area type="monotone" dataKey="tax" stroke="#FFB300" fill="url(#gTax)" strokeWidth={1.5} name="PAYE" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card col-span-12 lg:col-span-5 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Payroll Cost Composition</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Breakdown of gross payroll this month</div>
          {costBreakdown.map((c, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-[var(--t2)]">{c.name}</span>
                <span className="text-[11px] font-semibold" style={{ color: c.color }}>{c.value}%</span>
              </div>
              <div className="h-2 bg-[var(--glass)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: c.color }} />
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-[var(--p-line)]">
            <div className="text-[9px] font-bold text-[var(--t4)] uppercase tracking-wider mb-3">Disbursement Methods</div>
            {disbursementMethods.map((d, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-[11px] text-[var(--t2)]">{d.method}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[var(--t4)]">{d.count} staff</span>
                  <span className="text-[11px] font-semibold" style={{ color: d.color }}>{d.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Statutory Status + Payroll Exceptions */}
      <div className="grid grid-cols-12 gap-3">
        <div className="glass-card col-span-12 lg:col-span-5 p-5">
          <div className="text-[12px] font-medium text-[var(--t1)] mb-1">Statutory Compliance Status</div>
          <div className="text-[10px] text-[var(--t3)] mb-4">Filing readiness for current payroll cycle</div>
          {statutory.map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-[var(--glass)]">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                s.status === 'ready' ? 'bg-[var(--green)]/15' : 'bg-[var(--amber)]/15'
              }`}>
                {s.status === 'ready'
                  ? <CheckCircle className="w-4 h-4 text-[var(--green)]" />
                  : <AlertTriangle className="w-4 h-4 text-[var(--amber)]" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-[var(--t1)]">{s.label}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    s.status === 'ready' ? 'bg-[var(--green)]/15 text-[var(--green)]' : 'bg-[var(--amber)]/15 text-[var(--amber)]'
                  }`}>{s.status}</span>
                </div>
                <div className="text-[10px] text-[var(--t3)] mt-0.5">Due: {s.due}</div>
              </div>
              <div className="text-[12px] font-bold text-[var(--t1)]">{s.amount}</div>
            </div>
          ))}
        </div>

        <div className="glass-card col-span-12 lg:col-span-7 flex flex-col">
          <div className="p-4 border-b border-[var(--p-line)] flex justify-between items-center">
            <div>
              <div className="text-[12px] font-medium text-[var(--t1)]">Payroll Exceptions</div>
              <div className="text-[10px] text-[var(--t3)] mt-0.5">Issues blocking payroll disbursement</div>
            </div>
            <span className="text-[9px] font-bold text-[var(--red)] tracking-widest">5 OPEN</span>
          </div>
          <div className="p-3">
            {exceptions.map((e, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[var(--glass)]">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  e.severity === 'high' ? 'bg-[var(--red)]' :
                  e.severity === 'medium' ? 'bg-[var(--amber)]' : 'bg-[var(--p)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-[var(--t1)]">{e.name} <span className="text-[var(--t4)]">— {e.dept}</span></div>
                  <div className="text-[10px] text-[var(--t3)]">{e.issue}</div>
                </div>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                  e.severity === 'high' ? 'bg-[var(--red)]/15 text-[var(--red)]' :
                  e.severity === 'medium' ? 'bg-[var(--amber)]/15 text-[var(--amber)]' : 'bg-[var(--p)]/15 text-[var(--p)]'
                }`}>{e.severity}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--t4)]" />
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[var(--p-line)] grid grid-cols-3 gap-3 mt-auto">
            {[
              { label: 'Total Processed', val: '644', col: 'var(--green)' },
              { label: 'With Exceptions', val: '5', col: 'var(--red)' },
              { label: 'On Hold', val: '2', col: 'var(--amber)' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-[18px] font-bold" style={{ color: s.col }}>{s.val}</div>
                <div className="text-[9px] text-[var(--t3)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
