import { useState, useEffect } from 'react';
import {
  Search, Plus, ChevronLeft, ChevronRight,
  Settings, Edit3Icon, UserRoundCog,
  Copy, Building2, X, Save, Grid, List,
  MoreVertical, Phone, Mail, MapPin, Briefcase
} from 'lucide-react';
import DuplicateCheckModal from './DuplicateCheckModal';
import BulkEditModal from './BulkEditModal';
import BulkTerminateModal from './BulkTerminateModal';
import { motion, AnimatePresence } from 'framer-motion';
import { TownProps } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../UI/UserAvatar';
import LoadingSpinner from '../UI/LoadingSpinner';
import RoleButtonWrapper from '../ProtectedRoutes/RoleButton';

type Employee = Database['public']['Tables']['employees']['Row'];

interface AreaTownMapping {
  [area: string]: string[];
}

const EmployeeList: React.FC<TownProps> = ({ selectedTown, onTownChange }) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Area/Town mapping state
  const [areaTownMapping, setAreaTownMapping] = useState<AreaTownMapping>({});
  const [isArea, setIsArea] = useState<boolean>(false);
  const [townsInArea, setTownsInArea] = useState<string[]>([]);
  const [currentTown, setCurrentTown] = useState<string>(selectedTown || '');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = viewMode === 'list' ? 10 : 12;

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Bulk Edit State
  const [selectionAction, setSelectionAction] = useState<'relocate' | 'terminate' | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showBulkTerminateModal, setShowBulkTerminateModal] = useState(false);

  useEffect(() => {
    const loadMappings = async () => {
      try {
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('Branch, Town');

        if (employeesError) return;

        const mapping: AreaTownMapping = {};
        employeesData?.forEach(item => {
          if (item.Branch && item.Town) {
            if (!mapping[item.Branch]) mapping[item.Branch] = [];
            if (!mapping[item.Branch].includes(item.Town)) mapping[item.Branch].push(item.Town);
          }
        });
        setAreaTownMapping(mapping);

        const savedTown = localStorage.getItem('selectedTown');
        if (savedTown && (!selectedTown || selectedTown === 'ADMIN_ALL')) {
          setCurrentTown(savedTown);
          if (onTownChange) onTownChange(savedTown);
        } else if (selectedTown) {
          setCurrentTown(selectedTown);
          localStorage.setItem('selectedTown', selectedTown);
        }
      } catch (error) {
        console.error("Error in loadMappings:", error);
      }
    };
    loadMappings();
  }, [selectedTown, onTownChange]);

  useEffect(() => {
    if (currentTown && areaTownMapping[currentTown]) {
      setIsArea(true);
      setTownsInArea(areaTownMapping[currentTown]);
    } else {
      setIsArea(false);
      setTownsInArea([]);
    }
  }, [currentTown, areaTownMapping]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('employees')
        .select('*')
        .order('Employee Number', { ascending: false });

      if (currentTown && currentTown !== 'ADMIN_ALL') {
        if (isArea && townsInArea.length > 0) {
          query = query.in('Town', townsInArea);
        } else {
          query = query.eq('Town', currentTown);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setEmployees(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentTown, isArea, townsInArea]);

  const filteredEmployees = employees.filter(employee => {
    const isActive = !employee['Termination Date'];
    const statusMatch = selectedStatus === 'all' || 
                        (selectedStatus === 'active' && isActive) || 
                        (selectedStatus === 'inactive' && !isActive);
    
    const fullName = `${employee['First Name']} ${employee['Middle Name']} ${employee['Last Name']}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = fullName.includes(searchLower) ||
      (employee['Employee Number'] && String(employee['Employee Number']).toLowerCase().includes(searchLower)) ||
      (employee['Work Email'] && String(employee['Work Email']).toLowerCase().includes(searchLower)) ||
      (employee['Mobile Number'] && String(employee['Mobile Number']).toLowerCase().includes(searchLower));
    
    const matchesDepartment = selectedDepartment === 'all' || employee['Employee Type'] === selectedDepartment;
    const matchesBranch = selectedBranch === 'all' || employee.Branch === selectedBranch;

    return matchesSearch && matchesDepartment && matchesBranch && statusMatch;
  });

  const getDisplayName = () => {
    if (!currentTown || currentTown === 'ADMIN_ALL') return "Global operations";
    if (isArea) return `${currentTown} area`;
    return currentTown;
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const departments = ['all', ...new Set(employees.map(e => e['Employee Type']).filter(Boolean) as string[])];
  const branches = ['all', ...new Set(employees.map(e => e.Branch).filter(Boolean) as string[])];

  const toggleEmployeeSelection = (empId: string) => {
    setSelectedIds(prev => prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]);
  };

  const handleSelectAllOnPage = () => {
    const pageIds = currentEmployees.map(e => e['Employee Number']);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading" />;
  }

  return (
    <div className="animate-pgIn">
      {/* ── Header Section ── */}
      <div className="mb-[24px] flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[var(--t1)] tracking-tight">Personnel directory</h2>
          <p className="text-[10px] text-[var(--t3)] mt-1.5 font-medium uppercase tracking-widest">
            {filteredEmployees.length} total personnel · {getDisplayName()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleButtonWrapper allowedRoles={['ADMIN', 'HR']}>
            <button
              onClick={() => setShowDuplicateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--p-line)] bg-[var(--glass)] text-[var(--t3)] text-[11px] font-semibold hover:text-[var(--p)] transition-all"
            >
              <Copy size={14} /> Audit duplicates
            </button>
          </RoleButtonWrapper>
          <RoleButtonWrapper allowedRoles={['ADMIN', 'HR', 'MANAGER', 'REGIONAL']}>
            <button
              onClick={() => navigate('/add-employee')}
              className="shimmer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--p)] text-white text-[11px] font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-[var(--p-glow)]"
            >
              <Plus size={14} /> Onboard personnel
            </button>
          </RoleButtonWrapper>
        </div>
      </div>

      {/* ── Main Container ── */}
      <div className="glass-card overflow-hidden" style={{ padding: 0, borderRadius: 12 }}>
        
        {/* Filter Strip */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--p-line)] bg-[var(--glass)] flex-wrap">
          <div className="relative flex-1 max-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t4)]" />
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[var(--p-dim)] border-none rounded-xl py-2.5 pl-11 pr-4 text-[11px] text-[var(--t1)] placeholder-[var(--t4)] focus:ring-1 focus:ring-[var(--p-glow)] transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[var(--p-dim)] border-none rounded-xl px-4 py-2.5 text-[11px] text-[var(--t2)] font-medium focus:ring-1 focus:ring-[var(--p-glow)]"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[var(--p-dim)] border-none rounded-xl px-4 py-2.5 text-[11px] text-[var(--t2)] font-medium focus:ring-1 focus:ring-[var(--p-glow)]"
            >
              <option value="all">All branches</option>
              {branches.filter(b => b !== 'all').map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-[var(--p-dim)] border-none rounded-xl px-4 py-2.5 text-[11px] text-[var(--t2)] font-medium focus:ring-1 focus:ring-[var(--p-glow)]"
            >
              <option value="all">All departments</option>
              {departments.filter(d => d !== 'all').map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div style={{ width: 1, height: 24, background: 'var(--p-line)' }} />

          {/* View Toggle */}
          <div className="bg-[var(--p-dim)] p-1 rounded-xl flex items-center border border-[var(--p-line)]">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[var(--p)] text-white shadow-md' : 'text-[var(--t4)] hover:text-[var(--t2)]'}`}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[var(--p)] text-white shadow-md' : 'text-[var(--t4)] hover:text-[var(--t2)]'}`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {filteredEmployees.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 opacity-50"
            >
              <Search className="w-12 h-12 text-[var(--t4)] mx-auto mb-4" />
              <p className="text-[12px] font-semibold text-[var(--t3)] uppercase tracking-widest">No records detected</p>
              <p className="text-[10px] text-[var(--t4)] mt-2">Adjust your filters or search parameters</p>
            </motion.div>
          ) : viewMode === 'list' ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[var(--glass)] border-b border-[var(--p-line)]">
                    <th className="px-6 py-4 text-[10px] font-semibold text-[var(--t4)] uppercase tracking-wider w-10">#</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-[var(--t4)] uppercase tracking-wider">Personnel</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-[var(--t4)] uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-[var(--t4)] uppercase tracking-wider">Role & Unit</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-[var(--t4)] uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-[var(--t4)] uppercase tracking-wider text-center">Identity</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-[var(--t4)] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--p-line)]">
                  {currentEmployees.map((emp, idx) => {
                    const isActive = !emp['Termination Date'];
                    return (
                      <tr 
                        key={emp['Employee Number']}
                        className="hover:bg-[var(--glass-h)] transition-colors group cursor-pointer"
                        onClick={() => navigate(`/view-employee/${emp['Employee Number']}`)}
                      >
                        <td className="px-6 py-5 font-mono text-[11px] text-[var(--t4)]">
                          {String(indexOfFirstEmployee + idx + 1).padStart(2, '0')}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={emp['Work Email'] || `${emp['First Name']}${emp['Last Name']}`} size={32} showStatus={false} />
                            <div>
                              <div className="text-[12px] font-semibold text-[var(--t1)]">{emp['First Name']} {emp['Last Name']}</div>
                              <div className="text-[10px] font-mono text-[var(--t4)] mt-0.5">{emp['Employee Number']}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-0.5">
                            <div className="text-[11px] text-[var(--t2)]">{emp['Work Email'] || '—'}</div>
                            <div className="text-[10px] font-mono text-[var(--t4)]">{emp['Mobile Number'] || '—'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold text-[var(--t2)]">{emp['Job Title'] || '—'}</span>
                            <span className="text-[10px] text-[var(--t4)]">{emp['Branch']} · {emp['Town']}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold border ${
                            isActive ? 'bg-[var(--green-d)] text-[var(--green)] border-[var(--green-glow)]' : 'bg-[var(--red-d)] text-[var(--red)] border-[var(--red-glow)]'
                          }`}>
                            {isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1.5 text-[10px] text-[var(--green)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse shadow-[0_0_8px_var(--green-glow)]" />
                                Secured
                              </div>
                              <span className="text-[9px] font-mono text-[var(--t4)] uppercase">Node verified</span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/edit-employee/${emp['Employee Number']}`); }}
                              className="p-2 rounded-lg bg-[var(--p-dim)] text-[var(--p)] hover:bg-[var(--p)] hover:text-white transition-all"
                            >
                              <Edit3Icon size={14} />
                            </button>
                            <button className="p-2 rounded-lg bg-[var(--glass)] text-[var(--t4)] hover:text-[var(--t1)] transition-all">
                              <MoreVertical size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6"
            >
              {currentEmployees.map((emp) => {
                const isActive = !emp['Termination Date'];
                return (
                  <div 
                    key={emp['Employee Number']}
                    className="glass-card group hover:border-[var(--p-glow)] transition-all cursor-pointer p-5 flex flex-col gap-4 relative overflow-hidden"
                    onClick={() => navigate(`/view-employee/${emp['Employee Number']}`)}
                  >
                    <div className="absolute top-4 right-4">
                       <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[var(--green)] shadow-[0_0_8px_var(--green-glow)]' : 'bg-[var(--red)]'}`} />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <UserAvatar name={emp['Work Email'] || `${emp['First Name']}${emp['Last Name']}`} size={48} showStatus={isActive} />
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-[var(--t1)] truncate">{emp['First Name']} {emp['Last Name']}</h3>
                        <p className="text-[10px] text-[var(--t4)] font-mono mt-0.5">{emp['Employee Number']}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-[11px] text-[var(--t3)]">
                        <div className="w-7 h-7 rounded-lg bg-[var(--p-dim)] flex items-center justify-center shrink-0">
                          <Briefcase size={12} className="text-[var(--p)]" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-[var(--t2)]">{emp['Job Title'] || '—'}</div>
                          <div className="text-[10px] opacity-70">{emp['Branch']}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[11px] text-[var(--t3)]">
                        <div className="w-7 h-7 rounded-lg bg-[var(--glass-h)] flex items-center justify-center shrink-0">
                          <Phone size={12} className="text-[var(--t4)]" />
                        </div>
                        <span className="font-mono text-[10px]">{emp['Mobile Number'] || '—'}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-[var(--p-line)]">
                       <div className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--t4)] uppercase tracking-widest">
                          <MapPin size={10} /> {emp['Town']}
                       </div>
                       <button className="p-1.5 rounded-lg text-[var(--t4)] hover:text-[var(--p)] transition-colors">
                          <ChevronRight size={14} />
                       </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {filteredEmployees.length > 0 && (
          <div className="px-6 py-4 border-t border-[var(--p-line)] flex items-center justify-between bg-[var(--glass)]">
            <span className="text-[10px] font-mono text-[var(--t4)]">
              Displaying <span className="text-[var(--p)] font-semibold">{indexOfFirstEmployee + 1}–{Math.min(indexOfLastEmployee, filteredEmployees.length)}</span> of {filteredEmployees.length} records
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-[var(--p-line)] bg-[var(--p-dim)] text-[var(--t4)] disabled:opacity-30 hover:text-[var(--p)] transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page} 
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl text-[10px] font-bold transition-all ${
                      currentPage === page 
                        ? 'bg-[var(--p)] text-white shadow-lg shadow-[var(--p-glow)]' 
                        : 'bg-[var(--glass)] text-[var(--t4)] hover:bg-[var(--glass-h)] border border-[var(--p-line)]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-[var(--p-line)] bg-[var(--p-dim)] text-[var(--t4)] disabled:opacity-30 hover:text-[var(--p)] transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <DuplicateCheckModal isOpen={showDuplicateModal} onClose={() => setShowDuplicateModal(false)} employees={employees} onRefresh={fetchEmployees} />
      <BulkEditModal isOpen={showBulkEditModal} onClose={() => setShowBulkEditModal(false)} selectedIds={selectedIds} availableBranches={branches} availableTowns={branches} onSuccess={() => { fetchEmployees(); setSelectedIds([]); setSelectionAction(null); }} />
      <BulkTerminateModal isOpen={showBulkTerminateModal} onClose={() => setShowBulkTerminateModal(false)} selectedIds={selectedIds} onSuccess={() => { fetchEmployees(); setSelectedIds([]); setSelectionAction(null); }} />
    </div>
  );
};

export default EmployeeList;
