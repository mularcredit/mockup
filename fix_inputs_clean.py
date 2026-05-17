import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# First, let's just find all instances of the outer wrapper that have borders and remove the borders.
# The outer wrappers currently look like:
# <div className="col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
# or <div className="col-span-2 border border-[var(--p-line)] ...">

# Let's replace the borders from the outer container
content = re.sub(r'border border-\[var\(--p-line\)\] rounded-lg px-3 pb-2 pt-0 focus-within:border-\[var\(--p\)\] transition-colors', '', content)

# Now, Legal name still uses the old BG trick. Let's find it and replace it.
legal_old = """              <div className="col-span-2 sm:col-span-1 relative mt-1">
                <input type="text" id="legal_name" defaultValue="ZiraHR Technologies Limited" placeholder=" " className="block w-full px-3 py-2.5 text-[13px] text-[var(--t1)] !bg-transparent rounded-lg border border-[var(--p-line)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--p)] peer transition-colors" onChange={onChange} />
                <label htmlFor="legal_name" className="absolute text-[11px] font-semibold text-[var(--t3)] duration-200 transform -translate-y-4 scale-90 top-2 z-10 origin-[0] bg-[#121915] px-1 left-2.5 peer-focus:text-[var(--p)] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-90 pointer-events-none">Legal name</label>
              </div>"""

legal_new = """              <div className="col-span-2 sm:col-span-1 relative">
                <div className="relative group mt-2 flex items-center px-3">
                    <input type="text" defaultValue="ZiraHR Technologies Limited" className="block w-full text-[13px] text-[var(--t1)] !bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 peer relative z-10 py-3" onChange={onChange} placeholder=" " id="legal_name" />
                    <fieldset className="absolute inset-0 border border-[var(--p-line)] rounded-lg pointer-events-none peer-focus:border-[var(--p)] transition-colors m-0 p-0 top-[-8px] bottom-0">
                        <legend className="text-[10px] h-0 opacity-0 px-1 ml-2 transition-all duration-200 invisible peer-focus:max-w-full peer-focus:opacity-0 peer-placeholder-shown:max-w-0 pointer-events-none whitespace-nowrap">Legal name</legend>
                    </fieldset>
                    <label htmlFor="legal_name" className="absolute text-[13px] text-[var(--t4)] duration-200 transform -translate-y-4 scale-[0.8] top-2 z-20 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-[0.8] peer-focus:text-[var(--p)] cursor-text pointer-events-none whitespace-nowrap">Legal name</label>
                </div>
              </div>"""

content = content.replace(legal_old, legal_new)

# Make sure inputs are completely border-free to prevent the global border from taking effect
# The inputs have `border-0`. Let's change them to `!border-none`.
content = content.replace('border-0 appearance-none', '!border-none appearance-none')

with open(filepath, 'w') as f:
    f.write(content)

print("Double borders fixed.")
