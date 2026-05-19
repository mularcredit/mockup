import React from 'react';
import { 
  MapPin, CalendarDays, ShieldCheck, 
  Briefcase, Wallet, UserCircle, Clock, 
  Banknote, History, Plug, Palette, 
  FileText, CheckCircle2, ChevronRight, AlertCircle,
  MoreHorizontal, MoreVertical, ChevronDown, Check, Activity, ShieldAlert,
  TerminalSquare, Server, Cpu, Building2, User, Users, FileLock2,
  Share2, Network, Plus, UploadCloud, Search
} from 'lucide-react';

// ==========================================
// FOUNDATION
// ==========================================

export const BrandingConfig = () => (
  <div className="flex flex-col gap-10 animate-fade-in max-w-[1000px]">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Corporate Identity & Theming</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-2xl">
        Global interface parameters. Changes applied here cascade across all regional branches, self-service portals, and external facing documentation.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <label className="text-[12px] font-medium text-white">Primary brand color</label>
          <div className="flex items-center gap-4 bg-[var(--page)] p-3 rounded-md border border-[var(--glass-h)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--p)] shadow-sm" />
            <div className="flex flex-col flex-1">
              <input type="text" defaultValue="#D4AF37" className="bg-transparent border-none text-[15px] font-mono text-[var(--t1)] outline-none uppercase" />
              <span className="text-[11px] text-[var(--t4)]">Hexadecimal format</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[12px] font-medium text-white">Interface architecture</label>
          <div className="flex items-center justify-between bg-[var(--page)] p-4 rounded-md border border-[var(--glass-h)] cursor-pointer hover:border-[var(--t3)] transition-colors">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-medium text-[var(--t1)]">Midnight & Gold Protocol</span>
              <span className="text-[12px] text-[var(--t4)]">High-contrast dark mode system</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--t3)]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="text-[12px] font-medium text-white">Visual cascade preview</label>
        <div className="flex-1 bg-[var(--page)] border border-[var(--glass-h)] rounded-md p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-h)]">
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded-full bg-[var(--p)]" />
               <div className="h-2 w-24 bg-[var(--glass-h)] rounded" />
             </div>
             <div className="h-6 w-16 bg-[var(--p)] rounded-md opacity-20" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-2 w-full bg-[var(--glass-h)] rounded opacity-50" />
            <div className="h-2 w-3/4 bg-[var(--glass-h)] rounded opacity-50" />
            <div className="h-2 w-1/2 bg-[var(--glass-h)] rounded opacity-50" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const BranchesConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1200px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Organizational Node Topology</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-3xl">
        Hierarchical mapping of all operational entities. Defines reporting lines, operational cost centers, and site leadership structures for geographical and logical branches.
      </p>
    </div>

    <div className="glass-card rounded-lg border border-[var(--glass-h)] overflow-hidden shadow-sm bg-[var(--page)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--glass-h)] bg-[rgba(255,255,255,0.01)]">
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Entity / Node</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Parent Uplink</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Site Leadership</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Cost Center</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider text-right">Headcount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--glass-h)]">
          {[
            { name: 'Nairobi Global HQ', type: 'Primary Nexus', uplink: '—', leader: 'J. Kamau (CEO)', cc: 'CC-100-EXEC', count: 412 },
            { name: 'Mombasa Logistics Hub', type: 'Regional Center', uplink: 'Nairobi Global HQ', leader: 'S. Otieno (Dir. Ops)', cc: 'CC-204-LOG', count: 184 },
            { name: 'Eldoret Sales Node', type: 'Satellite Office', uplink: 'Nairobi Global HQ', leader: 'A. Mutua (Reg. Mgr)', cc: 'CC-305-ACQ', count: 42 },
            { name: 'Tech Infrastructure Unit', type: 'Logical Department', uplink: 'Nairobi Global HQ', leader: 'D. Kiprono (CTO)', cc: 'CC-401-ENG', count: 88 }
          ].map((b, i) => (
            <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
              <td className="py-4 px-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-medium text-[var(--t1)]">{b.name}</span>
                  <span className="text-[12px] text-[var(--t4)]">{b.type}</span>
                </div>
              </td>
              <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{b.uplink}</td>
              <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{b.leader}</td>
              <td className="py-4 px-6 text-[13px] font-mono text-[var(--t3)]">{b.cc}</td>
              <td className="py-4 px-6 text-[14px] font-mono text-[var(--t1)] text-right">{b.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const CalendarConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1000px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Global Fiscal & Operational Calendar</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-2xl">
        Defines system-wide statutory holidays, payroll cutoff dates, and performance review cycles. Affects leave accrual algorithms and timesheet submissions.
      </p>
    </div>

    <div className="glass-card rounded-lg border border-[var(--glass-h)] overflow-hidden bg-[var(--page)] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--glass-h)] bg-[rgba(255,255,255,0.01)]">
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Date / Window</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Operational Event</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Classification</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Workforce Impact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--glass-h)]">
          {[
            { date: 'Every 24th', name: 'Global Payroll Cutoff', type: 'FISCAL_CYCLE', impact: 'Timesheets Locked' },
            { date: '12 Dec 2026', name: 'Jamhuri Day', type: 'STATUTORY_HOLIDAY', impact: 'Non-Working Day (Paid)' },
            { date: '25 Dec 2026', name: 'Christmas Day', type: 'STATUTORY_HOLIDAY', impact: 'Non-Working Day (Paid)' },
            { date: 'Q4 2026', name: 'Annual Performance Review', type: 'HR_CYCLE', impact: 'Appraisal Phase Active' }
          ].map((h, i) => (
            <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
              <td className="py-4 px-6 text-[13px] font-mono text-[var(--t2)]">{h.date}</td>
              <td className="py-4 px-6 text-[14px] font-medium text-[var(--t1)]">{h.name}</td>
              <td className="py-4 px-6 text-[12px] text-[var(--t3)]">{h.type.replace('_', ' ')}</td>
              <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{h.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const PoliciesConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1000px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Corporate Governance & Policies</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-2xl">
        Centralized repository for organizational protocols. Dictates mandatory reading requirements, digital signature enforcement, and audit trails for compliance.
      </p>
    </div>

    <div className="flex flex-col gap-3">
      {[
        { name: 'Global Employee Handbook', v: 'v4.2', date: 'Oct 2026', scope: 'All Personnel', req: 'Mandatory Signature' },
        { name: 'Remote Work & Data Security', v: 'v1.0', date: 'Jan 2026', scope: 'Hybrid/Remote Contracts', req: 'Mandatory Signature' },
        { name: 'Executive Travel Guidelines', v: 'v2.1', date: 'Aug 2025', scope: 'Job Groups A & B', req: 'Read Only' }
      ].map((p, i) => (
        <div key={i} className="flex items-center justify-between p-5 bg-[var(--page)] rounded-md border border-[var(--glass-h)] hover:border-[var(--t3)] transition-colors group shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-lg bg-[var(--glass)] border border-[var(--glass-h)] flex items-center justify-center">
              <FileLock2 className="w-4 h-4 text-[var(--t3)]" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-medium text-[var(--t1)]">{p.name}</span>
                <span className="text-[11px] font-mono text-[var(--t4)] bg-[var(--glass)] px-2 py-0.5 rounded">{p.v}</span>
              </div>
              <div className="flex items-center gap-4 text-[12px] text-[var(--t3)]">
                <span>Applicability: <span className="text-[var(--t2)]">{p.scope}</span></span>
                <span className="w-1 h-1 rounded-full bg-[var(--glass-h)]" />
                <span>Last Revised: {p.date}</span>
              </div>
            </div>
          </div>
          <div className="text-[12px] font-medium text-[var(--t2)]">
            {p.req}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// STRUCTURE
// ==========================================

export const JobGroupsConfig = () => (
  <div className="flex flex-col lg:flex-row gap-6 animate-fade-in w-full">
    {/* Left Column: Create Role Form */}
    <div className="lg:w-1/3 flex flex-col gap-6">
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--p-line)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--p-dim)] flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-[var(--p)]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[var(--t1)]">Create Job Role</h3>
            <p className="text-[11px] text-[var(--t4)]">Define standard titles and job descriptions.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#00E5FF]/80 ml-1">Job Title / Designation</label>
            <input 
              type="text" 
              placeholder="e.g. Loan Officer" 
              className="w-full bg-white/[0.02] border border-[#00E5FF]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#00E5FF]/50 focus:bg-[#00E5FF]/[0.02] transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#00E5FF]/80 ml-1">Job Grade / Band</label>
            <select 
              className="w-full bg-[var(--page)] border border-[#00E5FF]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#00E5FF]/50 focus:bg-[#00E5FF]/[0.02] transition-all duration-300 appearance-none"
            >
              <option value="">Select Band</option>
              <option value="jg-a">JG-A (Executive)</option>
              <option value="jg-b">JG-B (Management)</option>
              <option value="jg-c">JG-C (Professional)</option>
              <option value="jg-d">JG-D (Support)</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#00E5FF]/80 ml-1">Department Mapping</label>
            <select 
              className="w-full bg-[var(--page)] border border-[#00E5FF]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#00E5FF]/50 focus:bg-[#00E5FF]/[0.02] transition-all duration-300 appearance-none"
            >
              <option value="">Select Department</option>
              <option value="exec">Executive</option>
              <option value="ops">Operations</option>
              <option value="risk">Credit & Risk</option>
              <option value="fin">Finance</option>
            </select>
          </div>

                    <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#00E5FF]/80 ml-1">Reports To (Parent Role)</label>
            <select 
              className="w-full bg-[var(--page)] border border-[#00E5FF]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#00E5FF]/50 focus:bg-[#00E5FF]/[0.02] transition-all duration-300 appearance-none"
            >
              <option value="">Select Parent Role (e.g., CEO)</option>
              <option value="ceo">Chief Executive Officer</option>
              <option value="coo">Chief Operations Officer</option>
              <option value="cfo">Chief Financial Officer</option>
              <option value="hr">Head of HR & Admin</option>
            </select>
          </div>

          <button className="f-btn flex items-center justify-center gap-2 py-2.5 mt-2 w-full">
            <Plus className="w-4 h-4" />
            Save Role
          </button>
        </div>
      </div>
    </div>

    {/* Right Column: List View */}
    <div className="lg:w-2/3 flex flex-col gap-4">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--t4)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search job roles..." 
            className="w-full bg-[var(--page)] border border-[#00E5FF]/20 rounded-xl pl-9 pr-4 py-2 text-[12px] text-white/90 focus:outline-none focus:border-[#00E5FF]/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-[var(--t2)] bg-[var(--glass)] border border-[var(--p-line)] rounded-lg hover:bg-[var(--p-dim)] hover:text-[var(--p)] transition-all">
            <UploadCloud className="w-4 h-4" />
            Bulk Upload
          </button>
        </div>
      </div>

      {/* List View */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--glass-h)] bg-[rgba(255,255,255,0.01)]">
                <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Job Title</th>
                <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Job Grade</th>
                <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Department Mapping</th>
                <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-h)]">
              {[
                { title: 'Chief Executive Officer', grade: 'JG-A', dept: 'Executive' },
                { title: 'Chief Operations Officer', grade: 'JG-A', dept: 'Operations' },
                { title: 'Head of Credit & Risk', grade: 'JG-B', dept: 'Credit & Risk' },
                { title: 'Branch Manager', grade: 'JG-C', dept: 'Operations' },
                { title: 'Loan Officer', grade: 'JG-D', dept: 'Operations' },
                { title: 'Credit Analyst', grade: 'JG-D', dept: 'Credit & Risk' },
                { title: 'IT & Systems Manager', grade: 'JG-B', dept: 'Technology' },
              ].map((j, i) => (
                <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors group">
                  <td className="py-4 px-6 text-[14px] font-medium text-[var(--t1)]">{j.title}</td>
                  <td className="py-4 px-6 text-[13px] font-mono font-medium text-[var(--p)]">{j.grade}</td>
                  <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{j.dept}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-[var(--t4)] hover:text-[var(--p)] p-1.5 rounded-lg hover:bg-[var(--p-dim)] transition-all opacity-0 group-hover:opacity-100 inline-flex">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export const CostCentersConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1200px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Financial Allocation Units</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-3xl">
        Accounting structures used to track payroll burdens, departmental expenses, and workforce recruitment budgets across the organization.
      </p>
    </div>

    <div className="glass-card rounded-lg border border-[var(--glass-h)] overflow-hidden bg-[var(--page)] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--glass-h)] bg-[rgba(255,255,255,0.01)]">
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">CC Code</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Description</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Account Manager</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider text-right">Headcount Mapped</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--glass-h)]">
          {[
            { code: 'CC-100-EXEC', desc: 'Executive Administration & Board', owner: 'J. Kamau', count: 12 },
            { code: 'CC-204-LOG', desc: 'Logistics & Supply Chain Operations', owner: 'S. Otieno', count: 245 },
            { code: 'CC-401-ENG', desc: 'Software Engineering & IT Infra', owner: 'D. Kiprono', count: 88 },
            { code: 'CC-500-HR', desc: 'Human Resources & Talent Acquisition', owner: 'R. Wanjiku', count: 15 }
          ].map((c, i) => (
            <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
              <td className="py-4 px-6 text-[13px] font-mono font-medium text-[var(--t1)]">{c.code}</td>
              <td className="py-4 px-6 text-[14px] text-[var(--t2)]">{c.desc}</td>
              <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{c.owner}</td>
              <td className="py-4 px-6 text-[14px] font-mono text-[var(--t2)] text-right">{c.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ==========================================
// WORKFORCE
// ==========================================

export const EmploymentTypesConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1000px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Contractual Taxonomies</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-3xl">
        Legal definitions of employment relationships. Determines systemic access lifespan, statutory deduction applicability, and benefit eligibility.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { type: 'Permanent & Pensionable', desc: 'Indefinite duration. Full statutory compliance and benefits.', hc: 412 },
        { type: 'Fixed-Term Contract', desc: 'Defined expiration date. Prorated benefits based on duration.', hc: 84 },
        { type: 'Probationary', desc: 'Pre-permanent evaluation phase. Standard duration 3-6 months.', hc: 22 },
        { type: 'Independent Consultant', desc: 'Non-payroll entity. Subject to withholding tax rules only.', hc: 9 }
      ].map((t, i) => (
        <div key={i} className="p-6 bg-[var(--page)] rounded-md border border-[var(--glass-h)] flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-start">
            <h4 className="text-[15px] font-medium text-[var(--t1)]">{t.type}</h4>
            <span className="text-[13px] font-mono text-[var(--t2)]">{t.hc} personnel</span>
          </div>
          <p className="text-[13px] text-[var(--t3)] leading-relaxed">{t.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export const LeaveTypesConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1000px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Absence Management Categories</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-3xl">
        Configuration of all time-off policies, dictating accrual rates, payroll impacts (paid/unpaid), and year-end balance rollover rules.
      </p>
    </div>

    <div className="glass-card rounded-lg border border-[var(--glass-h)] overflow-hidden bg-[var(--page)] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--glass-h)] bg-[rgba(255,255,255,0.01)]">
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Policy Name</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Default Allocation</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Payroll Impact</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Rollover Logic</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--glass-h)]">
          {[
            { name: 'Annual Leave', days: '21 Working Days', impact: 'Paid', logic: 'Max 10 days carried forward' },
            { name: 'Sick Leave', days: '14 Working Days', impact: 'Paid', logic: 'No rollover permitted' },
            { name: 'Maternity Leave', days: '90 Calendar Days', impact: 'Paid', logic: 'No rollover permitted' },
            { name: 'Compassionate Leave', days: '5 Working Days', impact: 'Paid', logic: 'No rollover permitted' },
            { name: 'Unpaid Absence', days: 'Unlimited', impact: 'Deducted from Base', logic: 'N/A' }
          ].map((l, i) => (
            <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
              <td className="py-4 px-6 text-[14px] font-medium text-[var(--t1)]">{l.name}</td>
              <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{l.days}</td>
              <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{l.impact}</td>
              <td className="py-4 px-6 text-[13px] text-[var(--t3)]">{l.logic}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const ShiftRulesConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[800px] gap-6 mt-4">
    <h3 className="text-xl font-medium text-[var(--t1)]">Shift & Roster Framework</h3>
    <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-2xl">
      The workforce scheduling subsystem is currently disabled for your organizational tier. This module requires the Advanced Operations License.
    </p>
    <div className="p-6 border border-[var(--glass-h)] rounded-md bg-[var(--page)] mt-2">
      <span className="text-[13px] font-medium text-[var(--t2)] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[var(--t4)]" /> Contact system administration to provision scheduling logic.
      </span>
    </div>
  </div>
);

// ==========================================
// PAYROLL
// ==========================================

export const StatutoryConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1000px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Statutory & Tax Compliance</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-3xl">
        Governing algorithms for national tax compliance. Changes to these parameters directly alter net-pay calculations across the entire workforce.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { name: 'PAYE Tax Algorithm', authority: 'Kenya Revenue Authority', val: 'Active (2026 Bands)', updated: '01 Jan 2026' },
        { name: 'NSSF Contributions', authority: 'National Social Security Fund', val: 'Tier I & II Activated', updated: '01 Jan 2026' },
        { name: 'SHA/NHIF Remittance', authority: 'Social Health Authority', val: '2.75% of Gross', updated: '01 Mar 2026' },
        { name: 'Affordable Housing Levy', authority: 'Ministry of Housing', val: '1.5% of Gross', updated: '01 Jan 2026' }
      ].map((s, i) => (
        <div key={i} className="p-6 bg-[var(--page)] rounded-md border border-[var(--glass-h)] flex flex-col gap-4 shadow-sm">
          <div className="flex flex-col gap-1">
            <h4 className="text-[15px] font-medium text-[var(--t1)]">{s.name}</h4>
            <span className="text-[12px] text-[var(--t3)]">{s.authority}</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-h)]">
            <span className="text-[13px] font-medium text-[var(--t1)]">{s.val}</span>
            <span className="text-[11px] text-[var(--t4)] font-mono">Synced: {s.updated}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const EarningsDeductionsConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1200px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Payroll Component Matrix</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-3xl">
        Structural definitions of all non-basic financial inputs and outputs. Controls taxable statuses, GL account mappings, and calculation methodologies.
      </p>
    </div>

    <div className="flex flex-col gap-8">
      <div className="glass-card rounded-lg border border-[var(--glass-h)] overflow-hidden bg-[var(--page)] shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--glass-h)] bg-[rgba(255,255,255,0.01)]">
          <h4 className="text-[13px] font-medium text-[var(--t1)]">Registered Earnings</h4>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--glass-h)]">
              <th className="py-3 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Component Name</th>
              <th className="py-3 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Calculation Method</th>
              <th className="py-3 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Tax Applicability</th>
              <th className="py-3 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">GL Mapping</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-h)]">
            {[
              { name: 'House Allowance', calc: 'Fixed Amount', tax: 'Fully Taxable', gl: 'GL-EX-001' },
              { name: 'Commuter Allowance', calc: 'Fixed Amount', tax: 'Fully Taxable', gl: 'GL-EX-002' },
              { name: 'Performance Bonus', calc: 'Variable', tax: 'Fully Taxable', gl: 'GL-EX-005' }
            ].map((a, i) => (
              <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                <td className="py-4 px-6 text-[13px] font-medium text-[var(--t1)]">{a.name}</td>
                <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{a.calc}</td>
                <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{a.tax}</td>
                <td className="py-4 px-6 text-[13px] font-mono text-[var(--t3)]">{a.gl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card rounded-lg border border-[var(--glass-h)] overflow-hidden bg-[var(--page)] shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--glass-h)] bg-[rgba(255,255,255,0.01)]">
          <h4 className="text-[13px] font-medium text-[var(--t1)]">Registered Deductions</h4>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--glass-h)]">
              <th className="py-3 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Component Name</th>
              <th className="py-3 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Calculation Method</th>
              <th className="py-3 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Tax Phase</th>
              <th className="py-3 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">GL Mapping</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-h)]">
            {[
              { name: 'SACCO Remittance', calc: 'Fixed Amount', tax: 'Post-Tax', gl: 'GL-LB-010' },
              { name: 'HELB Loan Recovery', calc: 'Fixed Amount', tax: 'Post-Tax', gl: 'GL-LB-012' },
              { name: 'Pension (Voluntary)', calc: '% of Basic Salary', tax: 'Pre-Tax Deductible', gl: 'GL-LB-015' }
            ].map((a, i) => (
              <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                <td className="py-4 px-6 text-[13px] font-medium text-[var(--t1)]">{a.name}</td>
                <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{a.calc}</td>
                <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{a.tax}</td>
                <td className="py-4 px-6 text-[13px] font-mono text-[var(--t3)]">{a.gl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const SalaryStructuresConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[800px] gap-6 mt-4">
    <h3 className="text-xl font-medium text-[var(--t1)]">Salary Architecture</h3>
    <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-2xl">
      This module provides advanced formula building for complex remuneration packages. It requires mapping to an existing Job Group before execution.
    </p>
  </div>
);

// ==========================================
// ACCESS & SECURITY
// ==========================================

export const RolesConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1200px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">Role-Based Access Control (RBAC)</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-3xl">
        Systemic permission groupings. Defines operational clearance levels, approval thresholds, and data visibility limits across the enterprise.
      </p>
    </div>

    <div className="glass-card rounded-lg border border-[var(--glass-h)] overflow-hidden bg-[var(--page)] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--glass-h)] bg-[rgba(255,255,255,0.01)]">
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Security Profile</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Clearance</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Visibility Scope</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider text-right">Active Users</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--glass-h)]">
          {[
            { role: 'System Administrator', clr: 'Level 5 (Unrestricted)', scope: 'Global Enterprise', users: 2 },
            { role: 'HR Director', clr: 'Level 4', scope: 'Global Workforce & Payroll', users: 3 },
            { role: 'Branch Manager', clr: 'Level 3', scope: 'Regional Node Only', users: 14 },
            { role: 'Finance Auditor', clr: 'Level 2 (Read-Only)', scope: 'Global Payroll & GL', users: 4 },
            { role: 'Standard Employee', clr: 'Level 1', scope: 'Self-Service Only', users: 345 }
          ].map((r, i) => (
            <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
              <td className="py-4 px-6 text-[14px] font-medium text-[var(--t1)]">{r.role}</td>
              <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{r.clr}</td>
              <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{r.scope}</td>
              <td className="py-4 px-6 text-[14px] font-mono text-[var(--t2)] text-right">{r.users}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const PermissionsConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[800px] gap-6 mt-4">
    <h3 className="text-xl font-medium text-[var(--t1)]">Granular Permission Matrix</h3>
    <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-2xl">
      Individual permission toggles are managed through the master Role configuration above to prevent policy fragmentation and ensure strict RBAC compliance.
    </p>
  </div>
);

export const AuditLogsConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1200px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">System Audit Trail</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-3xl">
        Immutable ledger of all administrative mutations, authentication events, and data exports. Retained for 7 years for compliance.
      </p>
    </div>

    <div className="glass-card rounded-lg border border-[var(--glass-h)] overflow-hidden bg-[var(--page)] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--glass-h)] bg-[rgba(255,255,255,0.01)]">
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Timestamp (UTC)</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Actor ID</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider">Event Description</th>
            <th className="py-4 px-6 text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider text-right">Origin IP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--glass-h)]">
          {[
            { time: '2026-05-16 10:42:05', user: 'j.kamau (Admin)', action: 'Updated Job Group JG-A limits', ip: '192.168.1.45' },
            { time: '2026-05-16 09:15:22', user: 's.otieno (Manager)', action: 'Approved Leave Request LVR-402', ip: '10.0.0.12' },
            { time: '2026-05-16 02:00:00', user: 'SYSTEM_CRON', action: 'Automated Database Backup Executed', ip: '127.0.0.1' },
            { time: '2026-05-15 23:54:11', user: 'r.wanjiku (HR)', action: 'Exported Payroll Manifest CSV', ip: '192.168.1.108' }
          ].map((l, i) => (
            <tr key={i} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
              <td className="py-4 px-6 text-[12px] font-mono text-[var(--t3)]">{l.time}</td>
              <td className="py-4 px-6 text-[13px] font-medium text-[var(--t1)]">{l.user}</td>
              <td className="py-4 px-6 text-[13px] text-[var(--t2)]">{l.action}</td>
              <td className="py-4 px-6 text-[12px] font-mono text-[var(--t3)] text-right">{l.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ==========================================
// INTEGRATIONS
// ==========================================

export const IntegrationsConfig = () => (
  <div className="flex flex-col animate-fade-in max-w-[1000px] gap-8">
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--glass-h)]">
      <h3 className="text-xl font-medium text-[var(--t1)]">External Systems & APIs</h3>
      <p className="text-[13px] text-[var(--t3)] leading-relaxed max-w-3xl">
        Secure API pipelines connecting the HR core to third-party services for payments, communications, and biometric attendance ingestion.
      </p>
    </div>

    <div className="flex flex-col gap-4">
      {[
        { name: 'M-PESA Daraja Uplink', desc: 'Direct B2C integration for mobile salary disbursement.', status: 'Connected', endpoint: 'api.safaricom.co.ke' },
        { name: 'Active Directory / Entra ID', desc: 'Single Sign-On (SSO) and identity provisioning.', status: 'Disconnected', endpoint: 'login.microsoftonline.com' },
        { name: 'ZKTeco Biometric Sync', desc: 'Automated timesheet generation via clock-in hardware.', status: 'Connected', endpoint: '192.168.1.10:8080' }
      ].map((int, i) => (
        <div key={i} className="flex items-center justify-between p-6 bg-[var(--page)] rounded-md border border-[var(--glass-h)] shadow-sm">
          <div className="flex flex-col gap-1 w-1/2">
            <h4 className="text-[15px] font-medium text-[var(--t1)]">{int.name}</h4>
            <p className="text-[13px] text-[var(--t3)]">{int.desc}</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[11px] font-mono text-[var(--t4)]">Endpoint: {int.endpoint}</span>
            <span className={`text-[12px] font-medium ${int.status === 'Connected' ? 'text-[var(--t1)]' : 'text-[var(--t3)]'}`}>
              Status: {int.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
