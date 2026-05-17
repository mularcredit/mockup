filepath = 'src/components/OrganizationSetup/SettingsPages.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Add a "Reports To" field to the Job Roles form
import re

new_field = """          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Reports To (Parent Role)</label>
            <select 
              className="w-full bg-[var(--page)] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300 appearance-none"
            >
              <option value="">Select Parent Role (e.g., CEO)</option>
              <option value="ceo">Chief Executive Officer</option>
              <option value="coo">Chief Operations Officer</option>
              <option value="cfo">Chief Financial Officer</option>
              <option value="hr">Head of HR & Admin</option>
            </select>
          </div>

          <button className="f-btn flex items-center justify-center gap-2 py-2.5 mt-2 w-full">"""

content = re.sub(r'<button className="f-btn flex items-center justify-center gap-2 py-2\.5 mt-2 w-full">', new_field, content)

with open(filepath, 'w') as f:
    f.write(content)

print("Added Reports To field.")
