import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace bg-transparent with !bg-transparent to force transparent background
content = content.replace('bg-transparent', '!bg-transparent')

with open(filepath, 'w') as f:
    f.write(content)

print("Forced transparent background on inputs.")
