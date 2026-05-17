import re
filepath = 'src/components/OrganizationSetup/Structure/OrgChart.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Update Card UI to match the exact design vibe
new_card = """  const OrgNodeCard = ({ node }: { node: OrgNode }) => {
    const hasChildren = node.children && node.children.length > 0;
    
    // Assign a color based on department or fallback
    const getDotColor = (dept: string | undefined) => {
      if (!dept) return 'bg-[#C8A84B]';
      if (dept === 'Executive') return 'bg-[#8B5A2B]'; // Brown
      if (dept === 'Operations' || dept === 'Credit & Risk') return 'bg-[#6B8E23]'; // Olive Green
      if (dept === 'Finance') return 'bg-[#CD853F]'; // Peru
      if (dept === 'Human Resources') return 'bg-[#7B68EE]'; // Purple
      if (dept === 'Technology') return 'bg-[#4682B4]'; // Steel Blue
      return 'bg-[#C8A84B]';
    };

    return (
      <div className={`node-container ${hasChildren ? 'has-children' : ''}`}>
        <div className="flex items-center gap-2.5 p-2 px-3 rounded-lg border border-[#C8A84B]/20 bg-[var(--page)] shadow-sm min-w-[140px] max-w-[160px] w-max mx-auto hover:border-[#C8A84B]/50 transition-all">
          {/* Colored Dot */}
          <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${getDotColor(node.department)}`} />
          
          {/* Node Details */}
          <div className="text-left flex-1 flex flex-col gap-[2px]">
            <div className="text-[11px] font-bold leading-tight text-white/90">
              {node.role}
            </div>
            {(node.department || node.approvalLimit) && (
              <div className="text-[8.5px] text-white/40 leading-tight font-mono">
                {node.department} {node.department && node.approvalLimit && '·'} {node.approvalLimit}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };"""

content = re.sub(r'  const OrgNodeCard = \(\{ node \}: \{ node: OrgNode \}\) => \{[\s\S]*?    \);\n  \};', new_card, content)

# 2. Remove the dotted background
content = content.replace('style={{ backgroundImage: "radial-gradient(circle, var(--p-line) 1px, transparent 1px)", backgroundSize: "20px 20px" }}', '')

with open(filepath, 'w') as f:
    f.write(content)

# Update CSS for tighter horizontal scrolling
css_filepath = 'src/components/OrganizationSetup/Structure/OrgChart.css'
with open(css_filepath, 'r') as f:
    css_content = f.read()

css_content = css_content.replace('padding: 20px 4px 0 4px;', 'padding: 20px 2px 0 2px;')

with open(css_filepath, 'w') as f:
    f.write(css_content)

print("Redesigned org chart to match reference image strictly.")
