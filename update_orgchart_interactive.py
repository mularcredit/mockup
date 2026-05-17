import re
filepath = 'src/components/OrganizationSetup/Structure/OrgChart.tsx'

content = """import React, { useState } from 'react';
import { User, Building, Plus, X } from 'lucide-react';
import './OrgChart.css';

interface OrgNode {
  id: string;
  role: string;
  department?: string;
  approvalLimit?: string;
  image?: string;
  children?: OrgNode[];
}

const AVAILABLE_ROLES = [
  { role: 'Chief Executive Officer', dept: 'Executive', limit: 'Unlimited' },
  { role: 'Chief Operations Officer', dept: 'Operations', limit: 'Up to 5M KES' },
  { role: 'Head of Credit & Risk', dept: 'Credit & Risk', limit: 'Up to 2M KES' },
  { role: 'Branch Operations Manager', dept: 'Operations', limit: 'Up to 1M KES' },
  { role: 'Branch Manager', dept: 'Operations', limit: 'Up to 500K KES' },
  { role: 'Loan Officer', dept: 'Operations', limit: 'Origination Only' },
  { role: 'Chief Financial Officer', dept: 'Finance', limit: 'Up to 10M KES' },
  { role: 'Chief Accountant', dept: 'Finance', limit: 'Up to 2M KES' },
  { role: 'Head of HR & Admin', dept: 'Human Resources', limit: 'Up to 1M KES' },
  { role: 'IT & Systems Manager', dept: 'Technology', limit: 'Up to 2M KES' },
];

const initialOrgData: OrgNode = {
  id: '1',
  role: 'Chief Executive Officer',
  department: 'Executive',
  approvalLimit: 'Unlimited',
  children: []
};

export default function OrgChart() {
  const [orgData, setOrgData] = useState<OrgNode>(initialOrgData);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Recursively update a node's role
  const updateNodeRole = (node: OrgNode, id: string, newRole: typeof AVAILABLE_ROLES[0]): OrgNode => {
    if (node.id === id) {
      return { 
        ...node, 
        role: newRole.role, 
        department: newRole.dept, 
        approvalLimit: newRole.limit 
      };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateNodeRole(child, id, newRole))
      };
    }
    return node;
  };

  // Recursively add a child
  const addChildNode = (node: OrgNode, parentId: string): OrgNode => {
    if (node.id === parentId) {
      const newNode: OrgNode = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'Unassigned Role',
        children: []
      };
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => addChildNode(child, parentId))
      };
    }
    return node;
  };

  const handleAssignRole = (roleItem: typeof AVAILABLE_ROLES[0]) => {
    if (selectedNodeId) {
      setOrgData(updateNodeRole(orgData, selectedNodeId, roleItem));
      setSelectedNodeId(null);
    }
  };

  const handleAddChild = (e: React.MouseEvent, parentId: string) => {
    e.stopPropagation();
    setOrgData(addChildNode(orgData, parentId));
  };

  const OrgNodeCard = ({ node }: { node: OrgNode }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isUnassigned = node.role === 'Unassigned Role';
    
    return (
      <div className={`node-container ${hasChildren ? 'has-children' : ''}`}>
        <div 
          onClick={() => setSelectedNodeId(node.id)}
          className={`glass-card relative flex items-center gap-2 p-2 rounded-full border transition-all cursor-pointer shadow-xl w-max max-w-[180px] group
            ${isUnassigned ? 'border-dashed border-[var(--p)] bg-[var(--p-dim)]' : 'border-[#C8A84B]/20 bg-white/[0.02] hover:border-[#C8A84B]/50'}
            ${selectedNodeId === node.id ? 'ring-2 ring-[var(--p)] border-[var(--p)]' : ''}
          `}
        >
          {/* Avatar Capsule */}
          <div className="w-8 h-8 rounded-full bg-[#1A1F1C] border border-[#C8A84B]/30 flex items-center justify-center shrink-0 overflow-hidden">
            <User className={`w-3.5 h-3.5 ${isUnassigned ? 'text-white/30' : 'text-[#C8A84B]'}`} />
          </div>
          
          {/* Node Details */}
          <div className="text-left flex-1 pr-2 flex flex-col gap-[1px]">
            <div className={`text-[11px] font-bold leading-tight ${isUnassigned ? 'text-[var(--p)]' : 'text-white/90'}`}>
              {node.role}
            </div>
            {node.department && (
              <div className="text-[8.5px] text-white/40 leading-tight">{node.department}</div>
            )}
            {node.approvalLimit && (
              <div className="mt-0.5 inline-flex items-center w-max px-1.5 py-0.5 rounded-full bg-[#C8A84B]/10 border border-[#C8A84B]/20 text-[7.5px] font-medium text-[#C8A84B]">
                Limit: {node.approvalLimit}
              </div>
            )}
          </div>

          {/* Add Child Button (appears on hover) */}
          <button 
            onClick={(e) => handleAddChild(e, node.id)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[var(--page)] border border-[var(--p-line)] flex items-center justify-center text-[var(--t3)] hover:text-[var(--p)] hover:border-[var(--p)] hover:bg-[var(--p-dim)] opacity-0 group-hover:opacity-100 transition-all z-10"
            title="Add Subordinate"
          >
            <Plus className="w-3 h-3" />
          </button>
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
            <h3 className="text-[14px] font-bold text-[var(--t1)]">Interactive Org Chart Builder</h3>
            <p className="text-[11px] text-[var(--t4)]">Click any node to assign a role, or click + to add subordinates.</p>
          </div>
        </div>
      </div>

      {/* Main Org Chart Area */}
      <div className="glass-card rounded-2xl border border-[var(--p-line)] overflow-hidden relative">
        <div className="org-tree p-8 pb-16 overflow-x-auto min-h-[500px] flex items-start justify-center">
          <ul>
            {renderTree(orgData)}
          </ul>
        </div>
      </div>

      {/* Role Selection Modal */}
      {selectedNodeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121915] border border-[var(--p-line)] rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--glass-h)]">
              <h3 className="text-[15px] font-bold text-[var(--t1)]">Assign Job Role</h3>
              <button 
                onClick={() => setSelectedNodeId(null)}
                className="p-1 rounded-md text-[var(--t4)] hover:text-white hover:bg-[var(--glass)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
              {AVAILABLE_ROLES.map((role, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAssignRole(role)}
                  className="flex flex-col items-start p-3 rounded-xl border border-[var(--glass-h)] hover:border-[var(--p)] hover:bg-[var(--p-dim)] transition-all text-left group"
                >
                  <span className="text-[13px] font-semibold text-white/90 group-hover:text-[var(--p)] transition-colors">{role.role}</span>
                  <div className="flex items-center gap-3 mt-1 opacity-70">
                    <span className="text-[11px] text-[var(--t3)]">{role.dept}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--glass-h)]" />
                    <span className="text-[10px] text-[#C8A84B]">{role.limit}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
"""

with open(filepath, 'w') as f:
    f.write(content)

print("Interactive OrgChart Builder deployed.")
