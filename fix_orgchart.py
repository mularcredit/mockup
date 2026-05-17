filepath = 'src/components/OrganizationSetup/Structure/OrgChart.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Update the interface
content = content.replace('  name: string;\n', '')

# 2. Update the rendering logic in OrgNodeCard
# Before:
# <div className="text-[13px] font-bold text-white/90 line-clamp-1">{node.name}</div>
# <div className="text-[11px] font-medium text-[#C8A84B]/80 line-clamp-1">{node.role}</div>
# After:
# <div className="text-[13px] font-bold text-white/90 line-clamp-1">{node.role}</div>
import re
content = re.sub(r'<div className="text-\[13px\] font-bold text-white/90 line-clamp-1">\{node\.name\}</div>\s*<div className="text-\[11px\] font-medium text-\[#C8A84B\]/80 line-clamp-1">\{node\.role\}</div>', r'<div className="text-[13px] font-bold text-white/90 line-clamp-1">{node.role}</div>', content)

# Also remove `alt={node.name}`
content = content.replace('alt={node.name}', 'alt={node.role}')

# 3. Update the mock data to remove all `name: '...',` lines
content = re.sub(r"\s*name:\s*'[^']+',\n", '\n', content)

with open(filepath, 'w') as f:
    f.write(content)

print("OrgChart names removed.")
