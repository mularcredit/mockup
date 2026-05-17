import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# I will just write the original inputs back with the new classes
replacements = [
    (r'<input className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none px-4 py-2\.5 text-\[13px\] text-\[var\(--t1\)\] focus:border-b-\[1\.5px\] focus:border-\[var\(--p\)\] outline-none transition-all" onChange=\{onChange\} />',
     r'<input type="text" defaultValue="ZiraHR Technologies Limited" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />', 1),
    
    (r'<input className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none px-4 py-2\.5 text-\[13px\] text-\[var\(--t1\)\] focus:border-b-\[1\.5px\] focus:border-\[var\(--p\)\] outline-none transition-all" onChange=\{onChange\} />',
     r'<input type="text" defaultValue="ZiraHR" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />', 1),
     
    (r'<input className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none px-4 py-2\.5 text-\[13px\] text-\[var\(--t1\)\] focus:border-b-\[1\.5px\] focus:border-\[var\(--p\)\] outline-none transition-all" onChange=\{onChange\} />',
     r'<input type="text" defaultValue="PVT-2023-XXXXX" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />', 1),
     
    (r'<input className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none px-4 py-2\.5 text-\[13px\] text-\[var\(--t1\)\] focus:border-b-\[1\.5px\] focus:border-\[var\(--p\)\] outline-none transition-all \[color-scheme:dark\]" onChange=\{onChange\} />',
     r'<input type="date" defaultValue="2023-01-15" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all [color-scheme:dark]" onChange={onChange} />', 1),
     
    (r'<input className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none pl-10 pr-4 py-2\.5 text-\[13px\] text-\[var\(--t1\)\] focus:border-b-\[1\.5px\] focus:border-\[var\(--p\)\] outline-none transition-all" onChange=\{onChange\} />',
     r'<input type="email" defaultValue="hr@zirahr.com" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none pl-8 pr-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />', 1),
     
    (r'<input className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none pl-10 pr-4 py-2\.5 text-\[13px\] text-\[var\(--t1\)\] focus:border-b-\[1\.5px\] focus:border-\[var\(--p\)\] outline-none transition-all" onChange=\{onChange\} />',
     r'<input type="tel" defaultValue="+254 700 000000" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none pl-8 pr-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />', 1),
     
    (r'<input className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none pl-10 pr-4 py-2\.5 text-\[13px\] text-\[var\(--t1\)\] focus:border-b-\[1\.5px\] focus:border-\[var\(--p\)\] outline-none transition-all" onChange=\{onChange\} />',
     r'<input type="url" defaultValue="https://zirahr.com" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none pl-8 pr-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />', 1),
     
    (r'<textarea className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none pl-10 pr-4 py-2\.5 text-\[13px\] text-\[var\(--t1\)\] focus:border-b-\[1\.5px\] focus:border-\[var\(--p\)\] outline-none transition-all resize-none" onChange=\{onChange\} />',
     r'<textarea rows={3} defaultValue="Prism Tower, Upper Hill\nNairobi, Kenya" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none pl-8 pr-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all resize-none" onChange={onChange} />', 1),
     
    (r'<input className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none px-3 py-2 text-\[12px\] text-\[var\(--t1\)\] uppercase font-mono" onChange=\{onChange\} />',
     r'<input type="text" defaultValue="P051XXXXXXX" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2 text-[12px] text-[var(--t1)] uppercase font-mono focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />', 1),
     
    (r'<input className="w-full bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none px-3 py-2 text-\[12px\] text-\[var\(--t1\)\] font-mono" onChange=\{onChange\} />',
     r'<input type="text" defaultValue="XXXXXXXX" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2 text-[12px] text-[var(--t1)] font-mono focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />', 3), # NSSF, SHA, Housing

    (r'<input className="flex-1 bg-transparent border-0 border-b border-\[var\(--p-line\)\] rounded-none px-3 py-1\.5 text-\[12px\] text-\[var\(--t1\)\] font-mono" onChange=\{onChange\} />',
     r'<input type="text" defaultValue="#F5A623" className="flex-1 bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-1.5 text-[12px] text-[var(--t1)] font-mono focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />', 1)
]

for search, replace, count in replacements:
    content = re.sub(search, replace, content, count=count)
    
# Wait, let's fix selects as well.
# <select className="..."> <option>...</option> </select>
# I deleted the type, but selects don't have type. Did I delete anything on selects? No, the regex was:
# <select className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-4 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange}>
# That's fine. Wait, select padding: let's change px-4 to px-0.
content = content.replace('rounded-none px-4 py-2.5', 'rounded-none px-0 py-2.5')

# Ensure the icon absolute left positions are adjusted since we removed px padding
content = content.replace('absolute left-3 top-1/2', 'absolute left-0 top-1/2')
content = content.replace('absolute left-3 top-3', 'absolute left-0 top-3')

with open(filepath, 'w') as f:
    f.write(content)

print("Attributes fixed.")
