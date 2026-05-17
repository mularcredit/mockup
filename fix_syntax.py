import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Fix the stray slash
content = content.replace('/ placeholder=" "', 'placeholder=" "')
# Wait, let's fix if it's `/ placeholder=" " id="..." />`
content = content.replace('/ placeholder=" "', 'placeholder=" "')

# Also fix the outer fieldset border!
# Right now we have:
# <div className="col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors">
#   <div className="relative group mt-2 flex items-center px-3">
#     ...
#     <fieldset className="absolute inset-0 border border-[var(--p-line)]...
# If the outer div has a border, and the fieldset has a border, we have DOUBLE borders!
# The script replaced `<fieldset className="...border...">` with `<div className="...border...">` but kept the border class.
# Let's remove the border from the outer wrapper.
# Outer wrapper class: 'col-span-2 sm:col-span-1 border border-[var(--p-line)] rounded-lg px-3 pb-2 pt-0 focus-within:border-[var(--p)] transition-colors'
# Let's clean it up to just 'col-span-2 sm:col-span-1'
content = re.sub(r'className="(col-span-[^"]*?|flex-1[^"]*?|w-full[^"]*?) border border-\[var\(--p-line\)\] rounded-lg px-3 pb-2 pt-0 focus-within:border-\[var\(--p\)\] transition-colors"', r'className="\1 relative"', content)

with open(filepath, 'w') as f:
    f.write(content)

print("Syntax fixed.")
