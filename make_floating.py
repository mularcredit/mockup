import re

filepath = 'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# I will write a function to replace fieldsets with the animated notch

def replacer(match):
    col_span = match.group(1)
    label_text = match.group(2)
    inner_html = match.group(3)
    
    # Check if there's an icon inside
    has_icon = "shrink-0" in inner_html or "absolute" in inner_html or "<Mail" in inner_html or "<Phone" in inner_html or "<Globe" in inner_html or "<MapPin" in inner_html
    
    # Extract the actual input tag
    input_match = re.search(r'<(input|select|textarea)([^>]+)>', inner_html)
    if not input_match: return match.group(0)
    
    tag = input_match.group(1)
    attrs = input_match.group(2)
    
    # Ensure placeholder=" " is present if it's an input or textarea
    if tag in ['input', 'textarea'] and 'placeholder=' not in attrs:
        attrs += ' placeholder=" "'
        
    # Generate unique ID for htmlFor
    id_name = re.sub(r'[^a-zA-Z0-z]', '', label_text.lower())
    
    # Ensure ID is added
    if 'id=' not in attrs:
        attrs += f' id="{id_name}"'
        
    # Replace w-full !bg-transparent border-none outline-none with peer classes
    new_input_class = "block w-full text-[13px] text-[var(--t1)] !bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 peer relative z-10"
    if tag == 'textarea':
        new_input_class += " py-3"
    elif tag == 'select':
        new_input_class += " py-3"
    else:
        new_input_class += " py-3"
        
    if has_icon:
        new_input_class += " pl-2" # because icon is next to it in flex
        
    # Rebuild input
    attrs = re.sub(r'className="[^"]+"', f'className="{new_input_class}"', attrs)
    if tag == 'select':
        # Select needs to capture its inner options
        select_inner = re.search(r'<select[^>]+>(.*?)</select>', inner_html, re.DOTALL)
        if select_inner:
            new_input = f"<{tag}{attrs}>{select_inner.group(1)}</select>"
        else:
            new_input = f"<{tag}{attrs}></select>"
    elif tag == 'textarea':
        new_input = f"<{tag}{attrs} />"
    else:
        new_input = f"<{tag}{attrs} />"
        
    # Extract icon if exists
    icon_html = ""
    if has_icon:
        icon_match = re.search(r'<([A-Z][a-zA-Z]+)\s+className="([^"]+shrink-0[^"]*)"\s*/>', inner_html)
        if icon_match:
            icon_html = f"<{icon_match.group(1)} className=\"{icon_match.group(2)}\" />"
            
    # Calculate legend ml and label left based on icon
    ml_class = "ml-8" if has_icon else "ml-2"
    left_class = "left-9" if has_icon else "left-3"
    
    # We will use the solid background trick instead of fieldset notch for reliability, it's easier and perfectly replicates MDBootstrap.
    # MDBootstrap actually uses a notch, but we can use bg-[var(--page)] or bg-[#141C18] which is exactly the card color.
    # Wait, the card is translucent. Let's just use `bg-[var(--glass)]` + `backdrop-blur-sm`? No, that doubles the blur.
    # I will use the notch trick because it is PERFECT.
    
    # NOTCH TRICK:
    notch_fieldset = f"""
        <fieldset className="absolute inset-0 border border-[var(--p-line)] rounded-lg pointer-events-none peer-focus:border-[var(--p)] transition-colors m-0 p-0 top-[-8px] bottom-0">
            <legend className="text-[10px] h-0 opacity-0 px-1 {ml_class} transition-all duration-200 invisible peer-focus:max-w-full peer-focus:opacity-0 peer-placeholder-shown:max-w-0 pointer-events-none whitespace-nowrap">{label_text}</legend>
        </fieldset>
    """
    
    # If it's a select, it doesn't have placeholder-shown, so it's always floated
    peer_classes = "peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-[0.8] peer-focus:text-[var(--p)]"
    if tag == 'select':
        peer_classes = "top-2 -translate-y-4 scale-[0.8] peer-focus:text-[var(--p)]"
        
    label_html = f"""
        <label htmlFor="{id_name}" className="absolute text-[13px] text-[var(--t4)] duration-200 transform -translate-y-4 scale-[0.8] top-2 z-20 origin-[0] {left_class} {peer_classes} cursor-text pointer-events-none whitespace-nowrap">{label_text}</label>
    """
    
    input_wrapper = f"""
        <div className="relative group mt-2 flex items-center { 'px-3' if not has_icon else 'pl-3 pr-2' }">
            {icon_html}
            {new_input}
            {notch_fieldset}
            {label_html}
        </div>
    """
    
    return f'<div className="{col_span}">{input_wrapper}</div>'

pattern = r'<fieldset className="(col-span-[^"]*?|flex-1[^"]*?|w-full[^"]*?|border [^"]*?)"[^>]*>\s*<legend className="[^"]*">([^<]+)</legend>\s*(.*?)\s*</fieldset>'
content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)

print("Animated notch floating labels applied.")
