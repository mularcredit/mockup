import { X, Check } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { departments } from './constants/departments';
import { employeeTypes } from './constants/employeeTypes';
import { branches } from './constants/branches';

interface NewPositionModalProps {
  onClose: () => void;
}

export const NewPositionModal = ({ onClose }: NewPositionModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold text-white">Create New Job Position</h3>
          <button 
            onClick={onClose}
            className="text-[var(--t3)] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Job Title</label>
            <input 
              type="text" 
              className="w-full px-3.5 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-[var(--t3)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] transition-all"
              placeholder="e.g. Software Developer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Department</label>
              <select className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)] transition-all">
                {departments.filter(d => d !== 'All Departments').map(dept => (
                  <option key={dept} value={dept} className="bg-[var(--card)] text-white">{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Employee Type</label>
              <select className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)] transition-all">
                <option value="" className="bg-[var(--card)] text-white">Select Type</option>
                {employeeTypes.map(type => (
                  <option key={type} value={type} className="bg-[var(--card)] text-white">{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Branch</label>
              <select className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)] transition-all">
                <option value="" className="bg-[var(--card)] text-white">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id} className="bg-[var(--card)] text-white">{branch.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Hiring Priority</label>
              <select className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)] transition-all">
                <option value="Normal" className="bg-[var(--card)] text-white">Normal</option>
                <option value="Urgent" className="bg-[var(--card)] text-white">Urgent</option>
                <option value="Critically Needed" className="bg-[var(--card)] text-white">Critically Needed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Job Description</label>
            <textarea 
              className="w-full px-3.5 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-[var(--t3)] focus:outline-none focus:border-[var(--p)] focus:ring-1 focus:ring-[var(--p)] resize-none transition-all"
              rows={4}
              placeholder="Enter detailed job description..."
            />
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <GlowButton 
              variant="secondary"
              size="sm"
              onClick={() => onClose()}
            >
              Cancel
            </GlowButton>
            <GlowButton 
              icon={Check}
              size="sm"
              onClick={() => {
                alert("New position created successfully");
                onClose();
              }}
            >
              Create Position
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
};