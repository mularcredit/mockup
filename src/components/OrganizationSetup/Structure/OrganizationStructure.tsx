import React, { useState } from 'react';
import { 
  Building, 
  UploadCloud, 
  Search, 
  MoreVertical, 
  Plus,
  Network
} from 'lucide-react';

const MOCK_DEPARTMENTS = [
  { id: 1, code: "EXEC", name: "Executive & Board", parent: "-" },
  { id: 2, code: "HR", name: "Human Resources", parent: "Executive & Board" },
  { id: 3, code: "FIN", name: "Finance & Accounting", parent: "Executive & Board" },
  { id: 4, code: "ENG", name: "Engineering", parent: "Executive & Board" },
  { id: 5, code: "FE", name: "Frontend Development", parent: "Engineering" },
  { id: 6, code: "BE", name: "Backend Infrastructure", parent: "Engineering" },
  { id: 7, code: "SAL", name: "Sales & Marketing", parent: "Executive & Board" },
];

export default function OrganizationStructure({ onChange }: { onChange?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepts = MOCK_DEPARTMENTS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
      
      {/* Left Column: Create Department Form */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--p-line)]">
            <div>
              <h3 className="text-[14px] font-bold text-[var(--t1)]">Create Department</h3>
              <p className="text-[11px] text-[var(--t4)]">Add a new organizational unit.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Department Code</label>
              <input 
                type="text" 
                placeholder="e.g. ENG" 
                className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Department Name</label>
              <input 
                type="text" 
                placeholder="e.g. Engineering" 
                className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Parent Department</label>
              <select 
                className="w-full bg-[var(--page)] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300 appearance-none"
              >
                <option value="">Select parent (Optional)</option>
                {MOCK_DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <button className="f-btn flex items-center justify-center gap-2 py-2.5 mt-2 w-full">
              <Plus className="w-4 h-4" />
              Save Department
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: List View & Bulk Upload */}
      <div className="lg:w-2/3 flex flex-col gap-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--t4)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search departments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--page)] border border-[#C8A84B]/20 rounded-xl pl-9 pr-4 py-2 text-[12px] text-white/90 focus:outline-none focus:border-[#C8A84B]/50 transition-all"
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--p-line)] bg-[var(--glass)]">
                  <th className="px-5 py-4 text-[11px] font-semibold text-[var(--t2)] uppercase tracking-wider">Code</th>
                  <th className="px-5 py-4 text-[11px] font-semibold text-[var(--t2)] uppercase tracking-wider">Department Name</th>
                  <th className="px-5 py-4 text-[11px] font-semibold text-[var(--t2)] uppercase tracking-wider">Parent Department</th>
                  <th className="px-5 py-4 text-[11px] font-semibold text-[var(--t2)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-h)]">
                {filteredDepts.map((dept) => (
                  <tr key={dept.id} className="hover:bg-[var(--glass-h)] transition-colors group">
                    <td className="px-5 py-3">
                      <span className="text-[12px] font-medium text-[var(--t2)] bg-[var(--glass)] px-2 py-1 rounded-md border border-[var(--p-line)]">
                        {dept.code}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-[13px] font-semibold text-[var(--t1)]">
                        {dept.name}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-[13px] text-[var(--t3)] flex items-center gap-2">
                        {dept.parent !== "-" && <Network className="w-3.5 h-3.5 text-[var(--t4)]" />}
                        {dept.parent}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-[var(--t4)] hover:text-[var(--p)] p-1.5 rounded-lg hover:bg-[var(--p-dim)] transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredDepts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-[var(--t3)] text-[13px]">
                      No departments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
