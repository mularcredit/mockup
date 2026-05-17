import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace('px-0 py-2.5', 'px-1 py-3')
content = content.replace('px-0 py-2 text-[12px]', 'px-1 py-2.5 text-[12px]')
content = content.replace('px-0 py-1.5', 'px-1 py-2')
content = content.replace('pl-8 pr-0 py-2.5', 'pl-8 pr-2 py-3')

with open(filepath, 'w') as f:
    f.write(content)

print("Paddings adjusted.")
