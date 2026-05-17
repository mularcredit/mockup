import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Let's fix the floating label position.
# The user says "the label is not within the border but under".
# If the fieldset is `top-[-8px]` and the label is `-translate-y-4` (which is -16px) from `top-2` (which is 8px), it ends up at -8px.
# But what if the input wrapper has `mt-2`?
# Maybe the easiest and most robust floating label in Tailwind is just using a wrapper and absolute label without fieldset top-[-8px].
# Let's completely replace the complex fieldset logic with the standard pure CSS floating label that just uses a background color.
# It is 1000x more reliable and perfectly places the label ON the border.
# The card background is `var(--card)` or we can just use `bg-[#131A17]`.
# Since the body is `var(--page)` and the card has `glass-card`, the combined color is around `#121915`.

def replacer(match):
    # This matches the inner div wrapper of the input
    full_match = match.group(0)
    
    # We want to remove the fieldset and modify the label to use bg-[#121915]
    # Remove fieldset
    full_match = re.sub(r'<fieldset.*?</fieldset>', '', full_match, flags=re.DOTALL)
    
    # Modify label
    # Add `bg-[#121915] px-1` to the label classes
    full_match = re.sub(r'(<label[^>]+className="[^"]+)\s+peer-placeholder-shown:', r'\1 bg-[#121915] px-1 peer-placeholder-shown:', full_match)
    
    # Also we need to make sure the input has a border! Since we removed the fieldset, the input itself MUST have the border.
    # Currently the input has `!border-none`. We need to change it to `border border-[var(--p-line)] focus:border-[var(--p)] rounded-lg`.
    full_match = full_match.replace('!border-none', 'border border-[var(--p-line)] rounded-lg focus:border-[var(--p)]')
    
    # Also remove `top-[-8px]` logic, the input itself will be the boundary.
    return full_match

# Find the relative group mt-2 flex items-center px-3 wrappers
pattern = r'<div className="relative group mt-2 flex items-center px-3">.*?</div>\s*</div>'
content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)

print("Floating labels reverted to standard background method.")
