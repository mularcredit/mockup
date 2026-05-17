import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ChevronDown,
  Activity,
  Wallet,
  Calendar,
  User,
  ArrowUpRight,
  Edit3,
  MoreVertical,
  FileText,
  ShieldCheck,
  AlertTriangle,
  X,
  Filter,
  RefreshCw,
  GanttChart
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const LoanRequestsAdmin = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedLoanAmount, setEditedLoanAmount] = useState('');
  const [editedInstallment, setEditedInstallment] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('loan_requests')
        .select('*')
        .order('time_added', { ascending: false });

      if (error) throw error;
      setLoans(data || []);

      const initialNotes: Record<string, string> = {};
      data?.forEach(loan => {
        initialNotes[loan.id] = loan.admin_notes || '';
      });
      setNotes(initialNotes);
    } catch (error) {
      toast.error('Failed to load loan registry');
    } finally {
      setIsLoading(false);
    }
  };

  const formatKES = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    let d = new Date(dateValue);
    return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleLoanAmountSave = async (id: string, amount: string) => {
    if (!amount || isNaN(Number(amount))) {
      toast.error('Invalid disbursement amount');
      return;
    }
    try {
      const { error } = await supabase.from('loan_requests').update({ "Loan Amount": Number(amount) }).eq('id', id);
      if (error) throw error;
      toast.success('Disbursement amount adjusted');
      setEditingId(null);
      fetchLoans();
    } catch (error) {
      toast.error('Protocol adjustment failed');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('loan_requests').update({ status, admin_notes: notes[id] || null }).eq('id', id);
      if (error) throw error;
      toast.success(`Loan request ${status.toLowerCase()}`);
      setSelectedLoan(null);
      fetchLoans();
    } catch (error) {
      toast.error('Status synchronization failed');
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan["Employee Number"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan["Full Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan["Office Branch"]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group"
        >
          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight italic">Loan registry</h2>
              <p className="text-indigo-100 text-[10px] font-semibold opacity-80">Credit management hub</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Wallet className="w-5 h-5 text-indigo-300" />
              </div>
              <span className="text-[10px] font-semibold text-indigo-100 italic">Disbursement console</span>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <div className="flex items-center justify-between text-[10px] font-semibold border-b border-white/10 pb-2">
                <span>Pending approval</span>
                <span className="text-amber-400">{loans.filter(l => !l.status || l.status.toLowerCase() === 'pending').length}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-semibold text-white/50 pt-2">
                <span>Total records</span>
                <span>{loans.length}</span>
              </div>
            </div>
          </div>
          <Activity className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
        </motion.div>

        {/* Sub Header Content */}
        <div className="lg:col-span-3 bg-[var(--card)] rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 italic">Credit verification matrix</h3>
              </div>
              <p className="text-[11px] font-semibold text-gray-400 leading-loose max-w-lg">
                Reviewing organizational credit exposure. All loan disbursements undergo multi-layer verification against basic salary anchors.
              </p>
            </div>

            <div className="flex flex-col gap-3 justify-end lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 justify-end">
                <div className="p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex flex-col items-end">
                  <span className="text-[8px] font-semibold text-gray-400">Aggregate exposure</span>
                  <span className="text-lg font-semibold text-indigo-600 italic">
                    {formatKES(loans.filter(l => l.status === 'Approved').reduce((acc, curr) => acc + (Number(curr["Loan Amount"]) || 0), 0))}
                  </span>
                </div>
                <button onClick={fetchLoans} className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Registry */}
      <div className="bg-[var(--card)] rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-[var(--glass)]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-[var(--card)] border border-gray-100 rounded-[2rem] text-[11px] font-semibold focus:ring-4 focus:ring-[var(--p-dim)] transition-all font-mono shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <GanttChart className="w-5 h-5 text-gray-300" />
            <span className="text-[10px] font-semibold text-gray-400">Active credit stream</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--glass)]">
                <th className="px-10 py-6 text-[10px] font-semibold text-gray-400">Employee name</th>
                <th className="px-10 py-6 text-[10px] font-semibold text-gray-400">Exposure</th>
                <th className="px-10 py-6 text-[10px] font-semibold text-gray-400">Recovery</th>
                <th className="px-10 py-6 text-[10px] font-semibold text-gray-400">Status</th>
                <th className="px-10 py-6 text-[10px] font-semibold text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLoans.map((loan) => (
                <motion.tr
                  key={loan.id}
                  layout
                  onClick={() => setSelectedLoan(loan)}
                  className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-lg shadow-indigo-100">
                        {loan["Full Name"][0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors italic">{loan["Full Name"]}</span>
                        <span className="text-[10px] font-medium text-gray-400">{loan["Employee Number"]} • {loan["Office Branch"]}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{formatKES(Number(loan["Loan Amount"]))}</span>
                      <span className="text-[9px] font-medium text-gray-400">Initial request</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 italic">{loan["Repayment Installment"] || 'N/A'}</span>
                      <span className="text-[9px] font-medium text-gray-400">Installment strategy</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-semibold capitalize border border-transparent shadow-sm ${getStatusStyles(loan["status"])}`}>
                      {loan["status"] || 'Pending'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="p-3 glass-card  border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loan Detail Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLoan(null)} className="fixed inset-0 bg-gray-900/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[var(--card)] rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col relative z-10 border border-white/20"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-[var(--glass)]">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold text-gray-900 tracking-tight italic">Credit manifest</h3>
                  <p className="text-[10px] font-semibold text-gray-400">Governance ID: {selectedLoan.id}</p>
                </div>
                <button onClick={() => setSelectedLoan(null)} className="p-4 bg-[var(--card)] text-gray-400 hover:text-red-500 rounded-2xl shadow-sm border border-gray-100 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                {/* Core Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 mb-3">Employee</p>
                    <span className="text-[11px] font-semibold text-gray-900 italic">{selectedLoan["Full Name"]}</span>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 mb-3">Basic salary</p>
                    <span className="text-[11px] font-semibold text-gray-900 font-mono">{formatKES(Number(selectedLoan["Basic Salary"]))}</span>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 mb-3">Intake date</p>
                    <span className="text-[11px] font-semibold text-gray-900 font-mono">{new Date(selectedLoan.time_added).toLocaleDateString()}</span>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 mb-3">Current status</p>
                    <span className={`text-[10px] font-semibold capitalize italic ${getStatusStyles(selectedLoan["status"])}`}>
                      {selectedLoan["status"] || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Deep Intelligence Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <label className="text-[10px] font-semibold text-gray-400 ml-1">Disbursement adjustment</label>
                    <div className="relative group">
                      <input
                        type="number"
                        defaultValue={selectedLoan["Loan Amount"]}
                        onBlur={(e) => handleLoanAmountSave(selectedLoan.id, e.target.value)}
                        className="w-full p-8 bg-gray-900 rounded-[2.5rem] text-2xl font-semibold text-indigo-400 shadow-inner focus:ring-4 focus:ring-[var(--p-dim)] transition-all font-mono"
                      />
                      <p className="absolute bottom-4 right-8 text-[10px] font-semibold text-white/20">KES</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[10px] font-semibold text-gray-400 ml-1">Reason for request</label>
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 min-h-[140px]">
                      <p className="text-xs font-semibold text-gray-600 leading-relaxed italic">"{selectedLoan["Reason for Loan"]}"</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-xl font-semibold text-gray-900 italic">Audit action center</h4>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-semibold text-gray-400 ml-1">Internal auditor remarks</label>
                    <textarea
                      value={notes[selectedLoan.id] || ''}
                      onChange={(e) => setNotes(p => ({ ...p, [selectedLoan.id]: e.target.value }))}
                      rows={3}
                      className="w-full p-6 bg-gray-50 border-none rounded-[2rem] text-[11px] font-semibold focus:ring-4 focus:ring-[var(--p-dim)] transition-all resize-none shadow-inner"
                      placeholder="Document audit findings..."
                    />
                  </div>

                  {(!selectedLoan["status"] || selectedLoan["status"].toLowerCase() === 'pending') && (
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => handleStatusUpdate(selectedLoan.id, 'Approved')} className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] text-[10px] font-semibold shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700">Authorize disbursement</button>
                      <button onClick={() => handleStatusUpdate(selectedLoan.id, 'Rejected')} className="px-10 py-5 bg-[var(--card)] border border-red-100 text-[10px] font-semibold text-red-500 rounded-[2rem] transition-all hover:bg-red-50">Revoke request</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoanRequestsAdmin;