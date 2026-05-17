import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace the fieldset for Legal name
original_legal_name = """              <fieldset className="col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Legal name</legend>
                <input type="text" defaultValue="ZiraHR Technologies Limited" className="w-full !bg-transparent border-none text-[13px] text-[var(--t1)] outline-none" onChange={onChange} />
              </fieldset>"""

new_legal_name = """              <div className="col-span-2 sm:col-span-1 relative mt-1">
                <input type="text" id="legal_name" defaultValue="ZiraHR Technologies Limited" placeholder=" " className="block w-full px-3 py-2.5 text-[13px] text-[var(--t1)] !bg-transparent rounded-lg border border-[var(--p-line)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--p)] peer transition-colors" onChange={onChange} />
                <label htmlFor="legal_name" className="absolute text-[11px] font-semibold text-[var(--t3)] duration-200 transform -translate-y-4 scale-90 top-2 z-10 origin-[0] bg-[#121915] px-1 left-2.5 peer-focus:text-[var(--p)] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-90 pointer-events-none">Legal name</label>
              </div>"""

content = content.replace(original_legal_name, new_legal_name)

with open(filepath, 'w') as f:
    f.write(content)

print("Floating label tested.")
