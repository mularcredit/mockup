filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace invalid syntax
content = content.replace('<div className="" flex flex-col gap-1.5>', '<div className="flex flex-col gap-1.5">')

with open(filepath, 'w') as f:
    f.write(content)

print("Syntax error fixed.")
