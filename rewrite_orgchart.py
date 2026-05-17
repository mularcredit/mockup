import re
filepath = 'src/components/OrganizationSetup/Structure/OrgChart.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Update OrgNodeCard UI
new_card = """  const OrgNodeCard = ({ node }: { node: OrgNode }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isUnassigned = node.role === 'Unassigned Role';
    
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
        <div 
          onClick={() => setSelectedNodeId(node.id)}
          className={`glass-card relative flex flex-col justify-center p-3.5 px-4 rounded-xl border transition-all cursor-pointer shadow-xl min-w-[170px] max-w-[200px] group
            ${isUnassigned ? 'border-dashed border-[var(--p)] bg-[var(--p-dim)]' : 'border-[#C8A84B]/20 bg-[#1A1F1C]/90 hover:border-[#C8A84B]/50'}
            ${selectedNodeId === node.id ? 'ring-2 ring-[var(--p)] border-[var(--p)]' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {/* Colored Dot */}
            <div className={`w-3 h-3 rounded-full shrink-0 ${isUnassigned ? 'bg-white/20' : getDotColor(node.department)}`} />
            
            {/* Node Details */}
            <div className="text-left flex-1 pr-2 flex flex-col gap-1">
              <div className={`text-[12px] font-bold leading-tight ${isUnassigned ? 'text-[var(--p)]' : 'text-white/90'}`}>
                {node.role}
              </div>
              {(node.department || node.approvalLimit) && (
                <div className="text-[10px] text-white/50 leading-tight font-medium font-mono">
                  {node.department} {node.department && node.approvalLimit && '·'} {node.approvalLimit}
                </div>
              )}
            </div>
          </div>

          {/* Add Child Button (appears on hover) */}
          <button 
            onClick={(e) => handleAddChild(e, node.id)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#1A1F1C] border border-[var(--p-line)] flex items-center justify-center text-[var(--t3)] hover:text-[var(--p)] hover:border-[var(--p)] hover:bg-[var(--p-dim)] opacity-0 group-hover:opacity-100 transition-all z-10"
            title="Add Subordinate"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };"""

content = re.sub(r'  const OrgNodeCard = \(\{ node \}: \{ node: OrgNode \}\) => \{[\s\S]*?    \);\n  \};', new_card, content)

# 2. Add Dotted Background
content = content.replace(
    '<div className="org-tree p-8 pb-16 overflow-x-auto min-h-[500px] flex items-start justify-center">',
    '<div className="org-tree p-8 pb-16 overflow-x-auto min-h-[500px] flex items-start justify-center" style={{ backgroundImage: "radial-gradient(circle, var(--p-line) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>'
)

with open(filepath, 'w') as f:
    f.write(content)

print("Redesigned org chart to match reference image.")
