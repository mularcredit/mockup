import { Search } from 'lucide-react';
import { branches } from './constants/branches';
import { departments } from './constants/departments';
import { statusOptions } from './constants/statusOptions';
import { employeeTypes } from './constants/employeeTypes';

interface FiltersSectionProps {
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const FiltersSection = ({
  selectedBranch,
  setSelectedBranch,
  selectedDepartment,
  setSelectedDepartment,
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  searchTerm,
  setSearchTerm,
}: FiltersSectionProps) => {
  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-6 shadow-sm">
      <h2 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Recruitment Filters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Branch Location</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)] transition-all"
          >
            <option value="all" className="bg-[var(--card)] text-white">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id} className="bg-[var(--card)] text-white">{branch.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Department</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)] transition-all"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept} className="bg-[var(--card)] text-white">{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Hiring Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)] transition-all"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status} className="bg-[var(--card)] text-white">{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Employee Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--p)] transition-all"
          >
            <option value="All Types" className="bg-[var(--card)] text-white">All Types</option>
            {employeeTypes.map((type) => (
              <option key={type} value={type} className="bg-[var(--card)] text-white">{type}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-[var(--t3)]" />
            </div>
            <input
              type="text"
              placeholder="Search positions or applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg text-xs text-white placeholder-[var(--t3)] focus:outline-none focus:border-[var(--p)] transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};