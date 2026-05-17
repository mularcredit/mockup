import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# We'll just replace the whole grid section manually for the 1st card to see if it's feasible
# Company Details form block:
original_block_1 = """            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-white mb-1.5">Legal name</label>
                <input type="text" defaultValue="ZiraHR Technologies Limited" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-white mb-1.5">Trading name (optional)</label>
                <input type="text" defaultValue="ZiraHR" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-white mb-1.5">Registration number</label>
                <input type="text" defaultValue="PVT-2023-XXXXX" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-white mb-1.5">Date of incorporation</label>
                <input type="date" defaultValue="2023-01-15" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all [color-scheme:dark]" onChange={onChange} />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-white mb-1.5">Industry / sector</label>
                <select className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange}>
                  <option>Technology & Software</option>
                  <option>Financial Services (SACCOs)</option>
                  <option>Education & Schools</option>
                  <option>Healthcare</option>
                  <option>Retail & FMCG</option>
                  <option>NGOs & Non-Profits</option>
                </select>
              </div>
            </div>"""

new_block_1 = """            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <fieldset className="col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Legal name</legend>
                <input type="text" defaultValue="ZiraHR Technologies Limited" className="w-full bg-transparent border-none text-[13px] text-[var(--t1)] outline-none" onChange={onChange} />
              </fieldset>
              
              <fieldset className="col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Trading name (optional)</legend>
                <input type="text" defaultValue="ZiraHR" className="w-full bg-transparent border-none text-[13px] text-[var(--t1)] outline-none" onChange={onChange} />
              </fieldset>
              
              <fieldset className="col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Registration number</legend>
                <input type="text" defaultValue="PVT-2023-XXXXX" className="w-full bg-transparent border-none text-[13px] text-[var(--t1)] outline-none" onChange={onChange} />
              </fieldset>
              
              <fieldset className="col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Date of incorporation</legend>
                <input type="date" defaultValue="2023-01-15" className="w-full bg-transparent border-none text-[13px] text-[var(--t1)] outline-none [color-scheme:dark]" onChange={onChange} />
              </fieldset>
              
              <fieldset className="col-span-2 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Industry / sector</legend>
                <select className="w-full bg-transparent border-none text-[13px] text-[var(--t1)] outline-none" onChange={onChange}>
                  <option>Technology & Software</option>
                  <option>Financial Services (SACCOs)</option>
                  <option>Education & Schools</option>
                  <option>Healthcare</option>
                  <option>Retail & FMCG</option>
                  <option>NGOs & Non-Profits</option>
                </select>
              </fieldset>
            </div>"""

content = content.replace(original_block_1, new_block_1)

# Contact block
original_block_2 = """            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="col-span-2 sm:col-span-1 relative">
                <label className="block text-[11px] font-semibold text-white mb-1.5">Primary email</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t4)]" />
                  <input type="email" defaultValue="hr@zirahr.com" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none pl-8 pr-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 relative">
                <label className="block text-[11px] font-semibold text-white mb-1.5">Primary phone</label>
                <div className="relative">
                  <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t4)]" />
                  <input type="tel" defaultValue="+254 700 000000" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none pl-8 pr-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
                </div>
              </div>
              <div className="col-span-2 relative">
                <label className="block text-[11px] font-semibold text-white mb-1.5">Website</label>
                <div className="relative">
                  <Globe className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t4)]" />
                  <input type="url" defaultValue="https://zirahr.com" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none pl-8 pr-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
                </div>
              </div>
              <div className="col-span-2 relative">
                <label className="block text-[11px] font-semibold text-white mb-1.5">HQ physical address</label>
                <div className="relative">
                  <MapPin className="absolute left-0 top-3 w-4 h-4 text-[var(--t4)]" />
                  <textarea rows={3} defaultValue="Prism Tower, Upper Hill\nNairobi, Kenya" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none pl-8 pr-0 py-2.5 text-[13px] text-[var(--t1)] focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all resize-none" onChange={onChange} />
                </div>
              </div>
            </div>"""

new_block_2 = """            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <fieldset className="col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Primary email</legend>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--t4)] shrink-0" />
                  <input type="email" defaultValue="hr@zirahr.com" className="w-full bg-transparent border-none text-[13px] text-[var(--t1)] outline-none" onChange={onChange} />
                </div>
              </fieldset>
              
              <fieldset className="col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Primary phone</legend>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--t4)] shrink-0" />
                  <input type="tel" defaultValue="+254 700 000000" className="w-full bg-transparent border-none text-[13px] text-[var(--t1)] outline-none" onChange={onChange} />
                </div>
              </fieldset>
              
              <fieldset className="col-span-2 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Website</legend>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--t4)] shrink-0" />
                  <input type="url" defaultValue="https://zirahr.com" className="w-full bg-transparent border-none text-[13px] text-[var(--t1)] outline-none" onChange={onChange} />
                </div>
              </fieldset>
              
              <fieldset className="col-span-2 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">HQ physical address</legend>
                <div className="flex items-start gap-2 pt-1">
                  <MapPin className="w-4 h-4 text-[var(--t4)] shrink-0 mt-0.5" />
                  <textarea rows={3} defaultValue="Prism Tower, Upper Hill\nNairobi, Kenya" className="w-full bg-transparent border-none text-[13px] text-[var(--t1)] outline-none resize-none" onChange={onChange} />
                </div>
              </fieldset>
            </div>"""

content = content.replace(original_block_2, new_block_2)

# Statutory block
original_block_3 = """            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-white mb-1">KRA PIN</label>
                <input type="text" defaultValue="P051XXXXXXX" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2 text-[12px] text-[var(--t1)] uppercase font-mono focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-white mb-1">NSSF employer no.</label>
                <input type="text" defaultValue="XXXXXXXX" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2 text-[12px] text-[var(--t1)] font-mono focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-white mb-1">SHA/NHIF employer no.</label>
                <input type="text" defaultValue="XXXXXXXX" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2 text-[12px] text-[var(--t1)] font-mono focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-white mb-1">Housing levy reg no.</label>
                <input type="text" defaultValue="XXXXXXXX" className="w-full bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-2 text-[12px] text-[var(--t1)] font-mono focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
              </div>
            </div>"""

new_block_3 = """            <div className="space-y-4">
              <fieldset className="border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">KRA PIN</legend>
                <input type="text" defaultValue="P051XXXXXXX" className="w-full bg-transparent border-none text-[12px] text-[var(--t1)] uppercase font-mono outline-none" onChange={onChange} />
              </fieldset>
              
              <fieldset className="border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">NSSF employer no.</legend>
                <input type="text" defaultValue="XXXXXXXX" className="w-full bg-transparent border-none text-[12px] text-[var(--t1)] font-mono outline-none" onChange={onChange} />
              </fieldset>
              
              <fieldset className="border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">SHA/NHIF employer no.</legend>
                <input type="text" defaultValue="XXXXXXXX" className="w-full bg-transparent border-none text-[12px] text-[var(--t1)] font-mono outline-none" onChange={onChange} />
              </fieldset>
              
              <fieldset className="border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Housing levy reg no.</legend>
                <input type="text" defaultValue="XXXXXXXX" className="w-full bg-transparent border-none text-[12px] text-[var(--t1)] font-mono outline-none" onChange={onChange} />
              </fieldset>
            </div>"""

content = content.replace(original_block_3, new_block_3)

# Colors block
original_block_4 = """            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-white mb-2">Primary accent</label>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--p)] shadow-lg cursor-pointer border border-[var(--glass)]" />
                  <input type="text" defaultValue="#F5A623" className="flex-1 bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-0 py-1.5 text-[12px] text-[var(--t1)] font-mono focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-white mb-2">Sidebar theme</label>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--sidebar)] shadow-lg cursor-pointer border border-[var(--glass)]" />
                  <select className="flex-1 bg-[var(--glass)] border border-[var(--p-line)] rounded-lg px-3 py-1.5 text-[12px] text-[var(--t1)]" onChange={onChange}>
                    <option>Dark Mode (Default)</option>
                    <option>Light Mode</option>
                    <option>Auto (System)</option>
                  </select>
                </div>
              </div>
            </div>"""

new_block_4 = """            <div className="space-y-4">
              <fieldset className="border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Primary accent</legend>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[var(--p)] shadow-sm cursor-pointer border border-[var(--glass)] shrink-0" />
                  <input type="text" defaultValue="#F5A623" className="w-full bg-transparent border-none text-[12px] text-[var(--t1)] font-mono outline-none" onChange={onChange} />
                </div>
              </fieldset>
              
              <fieldset className="border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
                <legend className="text-[10px] font-semibold text-white px-1">Sidebar theme</legend>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[var(--sidebar)] shadow-sm cursor-pointer border border-[var(--glass)] shrink-0" />
                  <select className="w-full bg-transparent border-none text-[12px] text-[var(--t1)] outline-none" onChange={onChange}>
                    <option>Dark Mode (Default)</option>
                    <option>Light Mode</option>
                    <option>Auto (System)</option>
                  </select>
                </div>
              </fieldset>
            </div>"""

content = content.replace(original_block_4, new_block_4)

with open(filepath, 'w') as f:
    f.write(content)

print("Fieldsets applied successfully.")
