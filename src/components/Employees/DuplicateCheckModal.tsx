import React, { useMemo, useState } from 'react';
import { X, Mail, CreditCard, AlertTriangle, Users, ChevronDown, ChevronUp, Copy, Trash2, Loader2, Search, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database } from '../../types/supabase';
import { supabase } from '../../lib/supabase';

type Employee = Database['public']['Tables']['employees']['Row'];

interface DuplicateCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    employees: Employee[];
    onRefresh: () => void;
}

const DuplicateCheckModal: React.FC<DuplicateCheckModalProps> = ({ isOpen, onClose, employees, onRefresh }) => {
    const [activeTab, setActiveTab] = useState<'id' | 'email'>('id');
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const duplicates = useMemo(() => {
        const idMap = new Map<number, Employee[]>();
        const emailMap = new Map<string, Employee[]>();

        employees.forEach(emp => {
            if (emp['ID Number']) {
                const id = emp['ID Number'];
                if (!idMap.has(id)) idMap.set(id, []);
                idMap.get(id)?.push(emp);
            }
            if (emp['Work Email']) {
                const email = emp['Work Email'].toLowerCase().trim();
                if (email) {
                    if (!emailMap.has(email)) emailMap.set(email, []);
                    emailMap.get(email)?.push(emp);
                }
            }
        });

        const duplicateIds = Array.from(idMap.entries())
            .filter(([_, list]) => list.length > 1)
            .map(([id, list]) => ({ value: id.toString(), employees: list }));

        const duplicateEmails = Array.from(emailMap.entries())
            .filter(([_, list]) => list.length > 1)
            .map(([email, list]) => ({ value: email, employees: list }));

        return { ids: duplicateIds, emails: duplicateEmails };
    }, [employees]);

    const toggleGroup = (value: string) => {
        setExpandedGroups(prev => prev.includes(value) ? prev.filter(g => g !== value) : [...prev, value]);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const confirmDelete = async () => {
        if (!employeeToDelete) return;
        try {
            setIsDeleting(true);
            const { error } = await supabase.from('employees').delete().eq('Employee Number', employeeToDelete['Employee Number']);
            if (error) throw error;
            setEmployeeToDelete(null);
            onRefresh();
        } catch (err) {
            console.error('Error deleting employee:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    const currentDuplicates = activeTab === 'id' ? duplicates.ids : duplicates.emails;
    const hasDuplicates = currentDuplicates.length > 0;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--page)]/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[var(--sidebar)] border border-[var(--p-line)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                >
                    {/* Header */}
                    <div className="px-6 py-5 flex items-center justify-between border-b border-[var(--p-line)] bg-[var(--glass)]">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[var(--p-dim)] text-[var(--p)] rounded-xl border border-[var(--p-line)]">
                                <Search size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[var(--t1)] uppercase tracking-tight">Duplicate <span className="text-[var(--p)]">Audit</span></h2>
                                <p className="text-[9px] text-[var(--t4)] font-mono uppercase tracking-widest mt-0.5">INTEGRITY_CHECK_PROTOCOL</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center text-[var(--t4)] hover:text-[var(--t1)] hover:bg-[var(--glass)] rounded-xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-2 bg-[var(--glass)] border-b border-[var(--p-line)] gap-2">
                        <button
                            onClick={() => setActiveTab('id')}
                            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 rounded-xl transition-all border
                ${activeTab === 'id' ? 'bg-[var(--p-dim)] text-[var(--p)] border-[var(--p-line)] shadow-lg' : 'text-[var(--t4)] border-transparent hover:text-[var(--t2)] hover:bg-[var(--glass)]'}
              `}
                        >
                            <CreditCard size={15} />
                            Duplicate IDs
                            {duplicates.ids.length > 0 && (
                                <span className="px-1.5 py-0.5 bg-[var(--red)] text-[var(--sidebar)] text-[9px] font-bold rounded-md animate-pulse">
                                    {duplicates.ids.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('email')}
                            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 rounded-xl transition-all border
                ${activeTab === 'email' ? 'bg-[var(--p-dim)] text-[var(--p)] border-[var(--p-line)] shadow-lg' : 'text-[var(--t4)] border-transparent hover:text-[var(--t2)] hover:bg-[var(--glass)]'}
              `}
                        >
                            <Mail size={15} />
                            Duplicate Emails
                            {duplicates.emails.length > 0 && (
                                <span className="px-1.5 py-0.5 bg-[var(--red)] text-[var(--sidebar)] text-[9px] font-bold rounded-md animate-pulse">
                                    {duplicates.emails.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-[var(--sidebar)] custom-scrollbar">
                        {!hasDuplicates ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="w-20 h-20 bg-[var(--green-d)] rounded-2xl flex items-center justify-center mb-6 border border-[var(--green-glow)]">
                                    <CheckCircle2 className="text-[var(--green)]" size={36} />
                                </div>
                                <h3 className="text-[var(--t1)] font-bold uppercase tracking-widest text-sm">Cluster Synchronized</h3>
                                <p className="text-[var(--t4)] text-[10px] mt-2 font-mono uppercase tracking-widest">
                                    ZERO_DUPLICATE_RECORDS_DETECTED
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-[var(--red-d)] text-[var(--red)] text-[10px] font-bold uppercase tracking-[0.15em] rounded-xl border border-[rgba(255,77,77,0.1)] mb-6 shadow-lg">
                                    <AlertTriangle size={18} />
                                    <span>
                                        CRITICAL: {currentDuplicates.length} DUPLICATE_GROUPS_IDENTIFIED. ACTION_REQUIRED.
                                    </span>
                                </div>

                                {currentDuplicates.map((group) => (
                                    <div key={group.value} className="glass-card border border-[var(--p-line)] overflow-hidden shadow-lg group">
                                        <button
                                            onClick={() => toggleGroup(group.value)}
                                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--glass-h)] transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="px-2.5 py-1 rounded bg-[var(--red)] text-[var(--sidebar)] text-[10px] font-bold font-mono">
                                                    {group.employees.length}x MATCH
                                                </div>
                                                <span className="font-mono text-xs font-bold text-[var(--t1)] tracking-tight">
                                                    {group.value}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(group.value); }}
                                                    className="p-1.5 hover:bg-[var(--p-dim)] rounded-lg text-[var(--t4)] hover:text-[var(--p)] transition-all"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                            <ChevronDown size={18} className={`text-[var(--t4)] transition-transform duration-300 ${expandedGroups.includes(group.value) ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {expandedGroups.includes(group.value) && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-[var(--p-line)] bg-[var(--glass)]"
                                                >
                                                    {group.employees.map((emp) => (
                                                        <div
                                                            key={emp['Employee Number']}
                                                            className="p-5 border-b border-[var(--p-line)] last:border-0 hover:bg-[var(--sidebar)]/50 transition-all flex items-center justify-between group/row"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-[var(--p-dim)] flex items-center justify-center text-[10px] font-bold text-[var(--p)] border border-[var(--p-line)]">
                                                                    {emp['First Name']?.[0]}{emp['Last Name']?.[0]}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-[13px] font-bold text-[var(--t1)] group-hover/row:text-[var(--p)] transition-colors">
                                                                        {emp['First Name']} {emp['Last Name']}
                                                                    </h4>
                                                                    <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--t4)] uppercase tracking-tight mt-0.5">
                                                                        <span>ID: {emp['Employee Number']}</span>
                                                                        <span className="opacity-20">|</span>
                                                                        <span className="text-[var(--green)]">{emp.Branch}</span>
                                                                        {emp['Termination Date'] && (
                                                                            <span className="text-[var(--red)] bg-[var(--red-d)] px-1.5 rounded-sm">DEACTIVATED</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[var(--p)] hover:bg-[var(--p-dim)] rounded-lg transition-all"
                                                                    onClick={() => window.open(`/edit-employee/${emp['Employee Number']}`, '_blank')}
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    onClick={() => setEmployeeToDelete(emp)}
                                                                    className="p-2 text-[var(--t4)] hover:text-[var(--red)] hover:bg-[var(--red-d)] rounded-lg transition-all"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-[var(--p-line)] bg-[var(--glass)] flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 bg-[var(--sidebar)] border border-[var(--p-line)] rounded-xl text-[11px] font-bold uppercase tracking-widest text-[var(--t3)] hover:text-[var(--t1)] hover:border-[var(--p)] transition-all"
                        >
                            Close Audit
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Confirmation Modal */}
            {employeeToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--page)]/80 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[var(--sidebar)] border border-[var(--p-line)] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-8"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[var(--red-d)] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--red-glow)]">
                                <AlertTriangle className="text-[var(--red)]" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--t1)] uppercase tracking-tight mb-2">Delete Duplicate?</h3>
                            <p className="text-[11px] text-[var(--t4)] font-mono uppercase tracking-widest leading-relaxed mb-8">
                                ARE_YOU_SURE_YOU_WANT_TO_PURGE <span className="text-[var(--t1)]">{employeeToDelete['First Name']} {employeeToDelete['Last Name']}</span>?_THIS_ACTION_IS_IRREVERSIBLE.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setEmployeeToDelete(null)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[var(--t4)] hover:text-[var(--t1)] transition-all"
                                >
                                    ABORT
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-[var(--red)] text-[var(--sidebar)] text-[11px] font-bold uppercase tracking-widest rounded-xl hover:brightness-110 shadow-[0_4px_15px_var(--red-glow)] disabled:opacity-30 flex items-center justify-center gap-2 transition-all"
                                >
                                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'EXECUTE_PURGE'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence >
    );
};

export default DuplicateCheckModal;
