const fs = require('fs');

function toSentenceCase(str) {
  // Simple sentence case: first letter uppercase, rest lowercase.
  // We should preserve acronyms like KRA, NSSF, SHA/NHIF, HQ.
  const acronyms = ["KRA", "PIN", "NSSF", "SHA/NHIF", "HQ"];
  return str.split(' ').map((word, i) => {
    if (acronyms.includes(word)) return word;
    if (i === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return word.toLowerCase();
  }).join(' ');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to match <label ...>Text</label>
  content = content.replace(/<label\s+className="([^"]+)">([^<]+)<\/label>/g, (match, classes, text) => {
    // Make text white and remove uppercase
    let newClasses = classes
      .replace(/text-\[var\(--t[234]\)\]/, 'text-white')
      .replace(/text-\[1[01]px\]/, 'text-[12px]')
      .replace(/\buppercase\b/, '')
      .replace(/\btracking-wide\b/, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Ensure text-white is there if not replaced
    if (!newClasses.includes('text-white')) {
      newClasses += ' text-white';
    }

    const newText = toSentenceCase(text);
    return `<label className="${newClasses}">${newText}</label>`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Processed ${filePath}`);
}

processFile('./src/components/OrganizationSetup/Foundation/OrganizationProfile.tsx');
processFile('./src/components/OrganizationSetup/SettingsPages.tsx');
