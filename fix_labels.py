import re
import os

files = [
    'src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx',
    'src/components/OrganizationSetup/SettingsPages.tsx'
]

def to_sentence_case(text):
    words = text.split(' ')
    acronyms = ["KRA", "PIN", "NSSF", "SHA/NHIF", "HQ"]
    res = []
    for i, w in enumerate(words):
        if w in acronyms:
            res.append(w)
        elif i == 0:
            res.append(w.capitalize())
        else:
            res.append(w.lower())
    return ' '.join(res)

for file in files:
    if not os.path.exists(file): continue
    with open(file, 'r') as f:
        content = f.read()

    def replace_label(m):
        classes = m.group(1)
        text = m.group(2)
        classes = re.sub(r'\buppercase\b', '', classes)
        classes = re.sub(r'\btracking-wide\b', '', classes)
        classes = re.sub(r'text-\[var\(--t[234]\)\]', 'text-white', classes)
        if 'text-white' not in classes:
            classes += ' text-white'
        classes = ' '.join(classes.split())
        new_text = to_sentence_case(text)
        return f'<label className="{classes}">{new_text}</label>'

    new_content = re.sub(r'<label\s+className="([^"]+)">([^<]+)</label>', replace_label, content)
    
    with open(file, 'w') as f:
        f.write(new_content)
    print(f"Updated {file}")
