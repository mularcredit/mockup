import re
import os

filepath = 'src/components/OrganizationSetup/Structure/OrganizationStructure.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Remove the grid view staff head section
grid_pattern = r'^\s*<p className="text-\[11px\] text-\[var\(--t3\)\] mb-4 flex items-center gap-1\.5">\n\s*<span className="w-5 h-5 rounded-full bg-\[var\(--p-dim\)\] text-\[var\(--p\)\] flex items-center justify-center text-\[8px\] font-bold">\n\s*\{dept\.head\.split\(\' \'\)\.map\(n => n\[0\]\)\.join\(\'\'\)\}\n\s*</span>\n\s*\{dept\.head\}\n\s*</p>\n'
content = re.sub(grid_pattern, '', content, flags=re.MULTILINE)

# Adjust the mb-2 to mb-4 to keep spacing
content = content.replace('className="flex justify-between items-start mb-2"', 'className="flex justify-between items-start mb-4"')

# 2. Remove staff names from tree view
# E.g. Sarah Ochieng · 4 members -> 4 members
staff_names = ["Sarah Ochieng · ", "David Mutua · ", "Grace Njoroge · ", "Victor Kamau · ", "Linda Chebet · "]
for name in staff_names:
    content = content.replace(name, "")

with open(filepath, 'w') as f:
    f.write(content)

print("Staff names removed.")
