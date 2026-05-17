import re
import os

files = [
    'src/components/OrganizationSetup/OrganizationSetup.tsx',
    'src/components/OrganizationSetup/SettingsPages.tsx',
    'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
]

for file in files:
    if not os.path.exists(file): continue
    with open(file, 'r') as f:
        content = f.read()

    # We want to replace rounded-2xl with rounded-lg
    # rounded-xl with rounded-lg
    # and rounded-lg with rounded-md for inputs (or just keep them rounded-md)
    # Let's do:
    # rounded-2xl -> rounded-lg
    # rounded-xl -> rounded-md
    # We should NOT touch rounded-full (used for circles)
    
    new_content = content.replace('rounded-2xl', 'rounded-lg')
    new_content = new_content.replace('rounded-xl', 'rounded-md')

    with open(file, 'w') as f:
        f.write(new_content)
    print(f"Updated {file}")
