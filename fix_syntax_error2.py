filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Fix the / /> issue
content = content.replace('/ />', '/>')

with open(filepath, 'w') as f:
    f.write(content)

print("Double slash error fixed.")
