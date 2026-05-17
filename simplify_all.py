import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Fix textarea MapPin
content = content.replace('<MapPin className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />', '<MapPin className="w-4 h-4 text-white/30 absolute left-3 top-3 pointer-events-none" />')

# Fix any remaining double slashes
content = content.replace('/ />', '/>')

# Now process ANY remaining floating labels (Statutory Registration etc)
def replacer(match):
    outer_div = match.group(1) # e.g. `<div className="">`
    inner_html = match.group(2)
    
    label_match = re.search(r'<label[^>]+>([^<]+)</label>', inner_html)
    label_text = label_match.group(1) if label_match else "Label"
    
    input_match = re.search(r'<(input|select|textarea)([^>]+)>', inner_html)
    if not input_match: return match.group(0)
    tag = input_match.group(1)
    attrs = input_match.group(2)
    
    new_class = "w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300"
    
    attrs = re.sub(r'className="[^"]+"', f'className="{new_class}"', attrs)
    attrs = attrs.replace('placeholder=" "', '')
    
    if tag == 'select':
        select_inner = re.search(r'<select[^>]+>(.*?)</select>', inner_html, re.DOTALL)
        inner_content = select_inner.group(1) if select_inner else ""
        new_input = f"<{tag}{attrs}>{inner_content}</{tag}>"
    elif tag == 'textarea':
        new_input = f"<{tag}{attrs} />"
    else:
        new_input = f"<{tag}{attrs} />"

    return f"""{outer_div.replace('>', ' flex flex-col gap-1.5>')}
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">{label_text}</label>
                {new_input}
              </div>"""

# Find remaining wrappers: <div className=""> <div className="relative group ..."> ... </div> </div>
pattern = r'(<div className="[^"]*">)\s*<div className="relative group mt-2 flex items-center[^>]*>(.*?)</div>\s*</div>'
content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)

print("All remaining floating labels simplified.")
