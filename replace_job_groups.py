import re
filepath = 'src/components/OrganizationSetup/SettingsPages.tsx'
with open(filepath, 'r') as f:
    content = f.read()

new_job_roles = """export const JobGroupsConfig = () => (
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
            <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Job Title / Designation</label>
            <input 
              type="text" 
              placeholder="e.g. Loan Officer" 
              className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Job Grade / Band</label>
            <select 
              className="w-full bg-[var(--page)] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300 appearance-none"
            >
              <option value="">Select Band</option>
              <option value="jg-a">JG-A (Executive)</option>
              <option value="jg-b">JG-B (Management)</option>
              <option value="jg-c">JG-C (Professional)</option>
              <option value="jg-d">JG-D (Support)</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Department Mapping</label>
            <select 
              className="w-full bg-[var(--page)] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300 appearance-none"
            >
              <option value="">Select Department</option>
              <option value="exec">Executive</option>
              <option value="ops">Operations</option>
              <option value="risk">Credit & Risk</option>
              <option value="fin">Finance</option>
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
);"""

content = re.sub(r'export const JobGroupsConfig = \(\) => \([\s\S]*?\n\);', new_job_roles, content)

# ensure we import Plus, UploadCloud, Search, Briefcase, MoreVertical if they are missing
if 'Briefcase' not in content:
    content = content.replace('import { ', 'import { Briefcase, ')
if 'UploadCloud' not in content:
    content = content.replace('import { ', 'import { UploadCloud, ')

with open(filepath, 'w') as f:
    f.write(content)

print("Job roles updated.")
