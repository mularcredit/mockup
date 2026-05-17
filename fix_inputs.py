import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

def replacer(match):
    tag = match.group(1)
    cls_str = match.group(2)
    rest = match.group(3)
    
    # 1. Background
    cls_str = cls_str.replace('bg-[var(--glass)]', 'bg-transparent')
    
    # 2. Border
    cls_str = cls_str.replace('border border-[var(--p-line)]', 'border-0 border-b border-[var(--p-line)]')
    
    # 3. Radius
    cls_str = re.sub(r'rounded-(md|lg|xl)', 'rounded-none', cls_str)
    
    # 4. Focus border
    cls_str = cls_str.replace('focus:border-[var(--p)]', 'focus:border-b-[1.5px] focus:border-[var(--p)]')
    
    # 5. Remove focus ring
    cls_str = re.sub(r'focus:ring-1\s*focus:ring-\[var\(--p-dim\)\]', '', cls_str)
    
    # Cleanup extra spaces
    cls_str = ' '.join(cls_str.split())
    
    return f'<{tag} className="{cls_str}"{rest}'

# Match <input className="..."
content = re.sub(r'<(input|select|textarea)\s+[^>]*?className="([^"]+)"(.*?)', replacer, content)

with open(filepath, 'w') as f:
    f.write(content)

print("Inputs updated.")
