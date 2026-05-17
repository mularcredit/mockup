filepath = 'src/components/OrganizationSetup/Structure/OrgChart.tsx'

content = """import React from 'react';
import { Building } from 'lucide-react';
import './OrgChart.css';

interface OrgNode {
  id: string;
  role: string;
  department?: string;
  approvalLimit?: string;
  image?: string;
  children?: OrgNode[];
}

const mockOrgData: OrgNode = {
  id: '1',
  role: 'Chief Executive Officer',
  department: 'Executive',
  approvalLimit: 'Unlimited',
  children: [
    {
      id: '2',
      role: 'Chief Operations Officer',
      department: 'Operations',
      approvalLimit: 'Up to 5M KES',
      children: [
        {
          id: '5',
          role: 'Head of Credit & Risk',
          department: 'Credit & Risk',
          approvalLimit: 'Up to 2M KES',
          children: [
            { id: '10', role: 'Credit Analysts', department: 'Credit & Risk' },
            { id: '11', role: 'Debt Recovery Manager', department: 'Credit & Risk' }
          ]
        },
        {
          id: '6',
          role: 'Branch Operations Manager',
          department: 'Operations',
          approvalLimit: 'Up to 1M KES',
          children: [
            { id: '12', role: 'Branch Managers', department: 'Operations', approvalLimit: 'Up to 500K KES' },
            { id: '13', role: 'Loan Officers', department: 'Operations', approvalLimit: 'Origination Only' }
          ]
        }
      ]
    },
    {
      id: '3',
      role: 'Chief Financial Officer',
      department: 'Finance',
      approvalLimit: 'Up to 10M KES',
      children: [
        { id: '7', role: 'Chief Accountant', department: 'Finance' },
        { id: '8', role: 'Treasury Manager', department: 'Finance' }
      ]
    },
    {
      id: '4',
      role: 'Head of HR & Admin',
      department: 'Human Resources',
    },
    {
      id: '9',
      role: 'IT & Systems Manager',
      department: 'Technology',
    }
  ]
};

export default function OrgChart() {
  
  const OrgNodeCard = ({ node }: { node: OrgNode }) => {
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
        <div className="glass-card relative flex flex-col justify-center p-3.5 px-4 rounded-xl border border-[#C8A84B]/20 bg-[#1A1F1C]/90 shadow-xl min-w-[170px] max-w-[200px] hover:border-[#C8A84B]/50 transition-all">
          <div className="flex items-center gap-3">
            {/* Colored Dot */}
            <div className={`w-3 h-3 rounded-full shrink-0 ${getDotColor(node.department)}`} />
            
            {/* Node Details */}
            <div className="text-left flex-1 pr-2 flex flex-col gap-1">
              <div className="text-[12px] font-bold leading-tight text-white/90">
                {node.role}
              </div>
              {(node.department || node.approvalLimit) && (
                <div className="text-[10px] text-white/50 leading-tight font-medium font-mono">
                  {node.department} {node.department && node.approvalLimit && '·'} {node.approvalLimit}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTree = (node: OrgNode) => {
    return (
      <li key={node.id}>
        <OrgNodeCard node={node} />
        {node.children && node.children.length > 0 && (
          <ul>
            {node.children.map(child => renderTree(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative">
      
      {/* Header */}
      <div className="flex items-center justify-between glass-card p-4 rounded-2xl border border-[var(--p-line)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--p-dim)] flex items-center justify-center">
            <Building className="w-4 h-4 text-[var(--p)]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[var(--t1)]">Approval Workflows Chart</h3>
            <p className="text-[11px] text-[var(--t4)]">Visual representation of enterprise reporting lines and approval limits.</p>
          </div>
        </div>
      </div>

      {/* Main Org Chart Area */}
      <div className="glass-card rounded-2xl border border-[var(--p-line)] overflow-hidden relative">
        <div className="org-tree p-8 pb-16 overflow-x-auto min-h-[500px] flex items-start justify-center" style={{ backgroundImage: "radial-gradient(circle, var(--p-line) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
          <ul>
            {renderTree(mockOrgData)}
          </ul>
        </div>
      </div>
      
    </div>
  );
}
"""

with open(filepath, 'w') as f:
    f.write(content)

print("Reverted to static OrgChart drawing.")
