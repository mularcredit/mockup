import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Clock, FileText, ShieldOff,
    XCircle, BarChart2, AlertTriangle, CheckCircle,
    RefreshCw, ChevronRight, Loader2, History, Bell, UserPlus
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import EmploymentStatusModule from './EmploymentStatusModule';
import LifecycleHistoryModule from './LifecycleHistoryModule';
import SuspensionModule from './SuspensionModule';
import HRReportsDashboard from './HRReportsDashboard';
import OnboardingContractHub from './OnboardingContractHub';
import { useHRNotifications, fetchAdminHRNotifications, markAdminNotificationRead, type HRNotification } from '../../hooks/useHRNotifications';

interface DashboardStats {
    on_probation: number;
    contracts_expiring: number;
    suspended: number;
    terminated: number;
    missing_joining_date: number;
    pending_confirmations: number;
    pending_interview: number;
}

const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'onboarding', label: 'Statutory Onboarding', icon: UserPlus },
    { id: 'status', label: 'Employment Status', icon: Users },
    { id: 'history', label: 'Lifecycle History', icon: History },
    { id: 'suspension', label: 'Suspension', icon: ShieldOff },
    { id: 'reports', label: 'Reports', icon: FileText },
];

export default function HRLifecycleDashboard() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(
        tabParam && ['overview', 'onboarding', 'status', 'history', 'suspension', 'reports'].includes(tabParam)
            ? tabParam
            : 'overview'
    );
    const [stats, setStats] = useState<DashboardStats>({
        on_probation: 0, contracts_expiring: 0,
        suspended: 0, terminated: 0, missing_joining_date: 0,
        pending_confirmations: 0, pending_interview: 0,
    });
    const [loading, setLoading] = useState(true);
    const [hrNotifications, setHrNotifications] = useState<HRNotification[]>([]);
    const { checkAndNotify } = useHRNotifications();

    useEffect(() => {
        if (tabParam && ['overview', 'onboarding', 'status', 'history', 'suspension', 'reports'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    const fetchDashboardStats = useCallback(async () => {
        setLoading(true);
        try {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const in30Days = new Date(today); in30Days.setDate(today.getDate() + 30);
            const in30Str = in30Days.toISOString().split('T')[0];

            const [empStatus, suspensions, terminations, interviews] = await Promise.all([
                supabase.from('hr_employment_status').select('*'),
                supabase.from('hr_suspensions').select('*').eq('is_active', true),
                supabase.from('hr_terminations').select('*').gte('created_at', new Date(Date.now() - 90 * 86400000).toISOString()),
                supabase.from('hr_termination_interviews').select('*').eq('is_completed', false)
            ]);

            const empData = empStatus.data || [];
            const suspData = suspensions.data || [];
            const termData = terminations.data || [];
            const intData = interviews.data || [];

            const onProbation = empData.filter(e => e.employment_type === 'Probation' && !e.is_confirmed &&
                e.probation_end_date && e.probation_end_date > todayStr).length;

            const contractsExpiring = empData.filter(e => e.employment_type === 'Contract' &&
                e.contract_end_date && e.contract_end_date >= todayStr && e.contract_end_date <= in30Str).length;

            const missingDates = empData.filter(e =>
                (e.employment_type === 'Probation' || e.employment_type === 'Contract') && !e.joining_date).length;

            const pendingConfirmations = empData.filter(e => e.employment_type === 'Probation' &&
                !e.is_confirmed && e.probation_end_date && e.probation_end_date <= todayStr).length;

            setStats({
                on_probation: onProbation,
                contracts_expiring: contractsExpiring,
                suspended: suspData.length,
                terminated: termData.length,
                missing_joining_date: missingDates,
                pending_confirmations: pendingConfirmations,
                pending_interview: intData.length,
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            toast.error('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadHRNotifications = useCallback(async () => {
        const notifs = await fetchAdminHRNotifications();
        setHrNotifications(notifs);
    }, []);

    const dismissNotification = async (id: number) => {
        await markAdminNotificationRead(id);
        setHrNotifications(prev => prev.filter(n => n.id !== id));
    };

    useEffect(() => {
        fetchDashboardStats();
        loadHRNotifications();
        checkAndNotify().then(() => loadHRNotifications());
    }, [fetchDashboardStats, loadHRNotifications, checkAndNotify]);

    const statCards = [
        { label: 'On Probation', value: stats.on_probation, gradient: 'from-[var(--p)] to-blue-500', tab: 'status' },
        { label: 'Contracts Expiring', value: stats.contracts_expiring, gradient: 'from-red-500 to-rose-500', tab: 'status' },
        { label: 'Suspended', value: stats.suspended, gradient: 'from-rose-500 to-red-500', tab: 'suspension' },
        { label: 'Missing Joining Date', value: stats.missing_joining_date, gradient: 'from-amber-500 to-yellow-500', tab: 'status' },
        { label: 'Pending Confirmations', value: stats.pending_confirmations, gradient: 'from-emerald-500 to-green-500', tab: 'status' },
    ];

    return (
        <div className="min-h-screen bg-transparent p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--t1)] flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--p)] to-[var(--p-glow)] flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.25)]">
                            <Users className="w-4 h-4 text-[#07080d]" />
                        </div>
                        HR Lifecycle Management
                    </h1>
                    <p className="text-sm text-[var(--t3)] mt-0.5">Complete HR lifecycle management — probation, contracts, leave, payroll, terminations & more</p>
                </div>
                <button
                    onClick={fetchDashboardStats}
                    className="flex items-center gap-2 px-3 py-2 text-xs bg-[var(--card)] border border-[var(--p-line)] rounded-lg hover:bg-[var(--p-dim)] hover:text-white transition-colors text-[var(--t3)]"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-sm mb-6 overflow-x-auto">
                <div className="flex min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`relative flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all whitespace-nowrap
                  ${isActive
                                        ? 'text-[var(--p)] border-b-2 border-[var(--p)] bg-[var(--p-dim)]'
                                        : 'text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--p-dim)] border-b-2 border-transparent'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && (
                        <div className="space-y-6">

                            {/* HR Notifications Banner */}
                            {hrNotifications.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[var(--p-dim)] border border-[var(--p-line)] rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <Bell className="w-4 h-4 text-[var(--p)]" />
                                        <h3 className="text-sm font-semibold text-[var(--p)]">
                                            {hrNotifications.length} Upcoming Expiry Alert{hrNotifications.length !== 1 ? 's' : ''}
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {hrNotifications.map(n => (
                                            <div key={n.id} className="flex items-center justify-between bg-[var(--card)] border border-[var(--p-line)] rounded-lg px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-[var(--p)] flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-medium text-white">{n.title}</p>
                                                        <p className="text-[10px] text-gray-400">{n.message}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-3">
                                                    <button
                                                        onClick={() => dismissNotification(n.id)}
                                                        className="text-gray-400 hover:text-white"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                                {statCards.map((card) => {
                                    return (
                                        <motion.button
                                            key={card.label}
                                            onClick={() => handleTabChange(card.tab)}
                                            whileHover={{ y: -2, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-4 text-left shadow-sm hover:border-[var(--p)] transition-all group cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[9px] tracking-wider uppercase text-[var(--t3)] font-semibold">{card.label}</span>
                                            </div>
                                            <div className="text-2xl font-bold text-white mb-0.5">
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : card.value}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-[var(--p)] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                                View details <ChevronRight className="w-3 h-3" />
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Quick Action Cards */}
                            <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl p-5 shadow-sm">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--t2)] mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Manage Employment Status', tab: 'status', desc: 'Probation, Contract, and Permanent conversions' },
                                        { label: 'Lifecycle History', tab: 'history', desc: 'View chronological timelines and lifecycle logs' },
                                        { label: 'Record Suspension', tab: 'suspension', desc: 'Suspend or reactivate team members' },
                                    ].map(action => {
                                        return (
                                            <button
                                                key={action.tab}
                                                onClick={() => handleTabChange(action.tab)}
                                                className="flex flex-col items-start gap-1 p-4 rounded-xl border border-[var(--p-line)] hover:border-[var(--p)] bg-[var(--card)] hover:bg-[var(--p-dim)] transition-all group text-left shadow-sm min-h-[100px]"
                                            >
                                                <p className="text-xs font-bold text-white group-hover:text-[var(--p)] transition-colors">{action.label}</p>
                                                <p className="text-[10px] text-[var(--t3)] leading-relaxed mt-1">{action.desc}</p>
                                                
                                                <div className="mt-auto pt-2 flex items-center gap-1 text-[9px] text-[var(--p)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Launch tool <ChevronRight className="w-2.5 h-2.5 animate-pulse" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Missing Joining Date Alert */}
                            {stats.missing_joining_date > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col gap-1"
                                >
                                    <p className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> CALCULATION BLOCK: {stats.missing_joining_date} Employee(s) missing Joining Date
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        Probation and contract end dates cannot be computed. Please assign joining dates to restore automated tracking.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('status')}
                                        className="text-[11px] font-semibold text-[var(--p)] underline hover:text-[var(--p-glow)] self-start mt-1"
                                    >
                                        View affected employees →
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {activeTab === 'onboarding' && <OnboardingContractHub />}
                    {activeTab === 'status' && <EmploymentStatusModule onRefresh={fetchDashboardStats} />}
                    {activeTab === 'history' && <LifecycleHistoryModule />}
                    {activeTab === 'suspension' && <SuspensionModule onRefresh={fetchDashboardStats} />}
                    {activeTab === 'reports' && <HRReportsDashboard stats={stats} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
