import React, { useState, useEffect } from 'react';
import {
    Smartphone, DollarSign, Send, RefreshCw,
    CheckCircle, XCircle, Clock, Activity,
    Search, Copy, ShieldCheck, Mail, AlertTriangle, Zap, Landmark, Building, MapPin, X, ArrowRight, TrendingUp, TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useUser } from '../ProtectedRoutes/UserContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// --- Types ---
interface MpesaCallback {
    id: number;
    transaction_id: string;
    originator_conversation_id: string;
    result_code: number;
    result_desc: string;
    amount: number;
    status: string;
    callback_date: string;
    raw_response?: string;
    result_type?: string;
    phone_number?: string;
    employee_name?: string;
}

const revenueData = [
  { month: 'Jan', actual: 65, target: 60, projection: 60 },
  { month: 'Feb', actual: 72, target: 68, projection: 68 },
  { month: 'Mar', actual: 78, target: 75, projection: 75 },
  { month: 'Apr', actual: 84, target: 82, projection: 82 },
  { month: 'May', actual: 87.4, target: 88, projection: 90 },
  { month: 'Jun', target: 92, projection: 94 },
  { month: 'Jul', target: 96, projection: 102 },
];

const MpesaZapPortal: React.FC = () => {
    const { user } = useUser();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [callbacks, setCallbacks] = useState<MpesaCallback[]>([]);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [utilityBalance, setUtilityBalance] = useState<string>('KES 1,240,500');

    // Confirmation State
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState('');

    const fetchCallbacks = async () => {
        try {
            setIsRefreshing(true);
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

            const { data, error } = await supabase
                .from('mpesa_callbacks')
                .select('*')
                .neq('result_type', 'TransactionStatus')
                .neq('result_type', 'TransactionStatus_Pending')
                .gt('callback_date', oneDayAgo)
                .order('callback_date', { ascending: false })
                .limit(25);

            if (error) throw error;
            const enhanced = await enhanceWithEmployees(data || []);
            setCallbacks(enhanced);
        } catch (err) {
            console.error('Error fetching callbacks:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const enhanceWithEmployees = async (data: any[]) => {
        const phones = data.map(c => c.phone_number).filter(Boolean);
        if (phones.length === 0) return data;
        const cleanPhones = phones.map(p => p.replace(/\D/g, '').slice(-9));
        const { data: employees } = await supabase
            .from('employees')
            .select('"Full Name", "Mobile Number"')
            .or(cleanPhones.map(p => `"Mobile Number".ilike.%${p}%`).join(','));

        const empMap: Record<string, string> = {};
        employees?.forEach(e => {
            const p = e["Mobile Number"]?.replace(/\D/g, '').slice(-9);
            if (p) empMap[p] = e["Full Name"];
        });

        return data.map(c => ({
            ...c,
            employee_name: c.phone_number ? empMap[c.phone_number.replace(/\D/g, '').slice(-9)] : undefined
        }));
    };

    useEffect(() => {
        fetchCallbacks();
    }, []);

    const handleInitiateZap = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmSend = async () => {
        if (confirmEmail.toLowerCase() !== user?.email?.toLowerCase()) {
            toast.error('Verification failed.');
            return;
        }
        toast.success('Disbursement initiated');
        setShowConfirm(false);
    };

    return (
        <div className="animate-pgIn space-y-4 pb-12" style={{ padding: '0 26px' }}>
            {/* ── HEADER ── */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <div className="text-[11px] text-[var(--t3)] font-medium mb-1">M-Pesa · Global disbursement</div>
                    <h1 className="text-[20px] font-semibold text-[var(--t1)] tracking-tight">Revenue engine monitor</h1>
                    <div className="text-[10px] text-[var(--t4)] mt-1 font-medium">Real-time disbursement analytics · May 2025</div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--green-d)] border border-[var(--green-glow)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
                        <span className="text-[10px] font-semibold text-[var(--green)]">API is online</span>
                    </div>
                    <button onClick={fetchCallbacks} className="p-2.5 rounded-xl border border-[var(--p-line)] bg-[var(--glass)] text-[var(--t4)] hover:text-[var(--p)] transition-all">
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* ── METRIC STRIP ── */}
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-[rgba(245,166,35,0.1)] to-[rgba(245,166,35,0.02)] border border-[var(--p-glow)] shadow-2xl relative overflow-hidden group hover:translate-y-[-2px] transition-all">
                    <div className="absolute top-4 right-4 text-[9px] font-semibold text-[var(--p)] bg-[var(--p-dim)] px-2 py-0.5 rounded-full">↑ 12.4% vs April</div>
                    <div className="text-[24px] font-semibold text-[var(--t1)] mb-1">KES 87.4M</div>
                    <div className="text-[11px] font-semibold text-[var(--t2)] mb-2 tracking-tight">Total revenue · May 2025</div>
                    <div className="text-[10px] text-[var(--t4)] font-medium">28,416 paying subs · KES 3,075 avg/sub</div>
                </div>

                <div className="col-span-12 md:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-[rgba(0,245,155,0.1)] to-[rgba(0,245,155,0.02)] border border-[var(--green-glow)] shadow-2xl relative overflow-hidden group hover:translate-y-[-2px] transition-all">
                    <div className="absolute top-4 right-4 text-[9px] font-semibold text-[var(--green)] bg-[var(--green-d)] px-2 py-0.5 rounded-full">99.97% uptime</div>
                    <div className="text-[24px] font-semibold text-[var(--green)] mb-1">96.8%</div>
                    <div className="text-[11px] font-semibold text-[var(--t2)] mb-2 tracking-tight">Collection success rate</div>
                    <div className="text-[10px] text-[var(--t4)] font-medium">896 overdue · KES 2.4M at risk</div>
                </div>

                <div className="col-span-12 md:col-span-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--p-line)] shadow-2xl relative overflow-hidden group hover:translate-y-[-2px] transition-all">
                    <div className="absolute top-4 right-4 text-[9px] font-semibold text-[var(--red)] bg-[var(--red-d)] px-2 py-0.5 rounded-full">⚠ 312 failed txns</div>
                    <div className="text-[24px] font-semibold text-[var(--t1)] mb-1">4.4 mo</div>
                    <div className="text-[11px] font-semibold text-[var(--t2)] mb-2 tracking-tight">Runway to KES 120M goal</div>
                    <div className="text-[10px] text-[var(--t4)] font-medium">+1,100 net subs/mo · Need +4,824 total</div>
                </div>
            </div>

            {/* ── INSIGHT BAND ── */}
            <div className="grid grid-cols-10 gap-px bg-[var(--p-line)] border border-[var(--p-line)] rounded-xl overflow-hidden">
                {[
                    { l: 'Daily average', v: 'KES 2.82M', s: 'Target 3.0M', c: 'var(--green)' },
                    { l: 'Peak window', v: '8–9 AM', s: '42% volume', c: 'var(--t1)' },
                    { l: 'Average trans', v: 'KES 3,075', s: 'All plans', c: 'var(--t1)' },
                    { l: 'Overdue accounts', v: '896', s: '3.2% base', c: 'var(--amber)' },
                    { l: 'Recovery rate', v: '74%', s: 'KES 1.8M saved', c: 'var(--green)' },
                ].map((ib, i) => (
                    <div key={i} className="col-span-2 bg-[var(--card)] p-3 hover:bg-[var(--card-h)] transition-colors">
                        <div className="text-[9px] font-semibold text-[var(--t4)] mb-1">{ib.l}</div>
                        <div className="text-[15px] font-semibold" style={{ color: ib.c }}>{ib.v}</div>
                        <div className="text-[9px] text-[var(--t3)] font-medium mt-0.5">{ib.s}</div>
                    </div>
                ))}
            </div>

            {/* ── CHARTS ROW ── */}
            <div className="grid grid-cols-12 gap-3">
                {/* Revenue Trend */}
                <div className="col-span-12 lg:col-span-8 glass-card p-5">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="text-[13px] font-semibold text-[var(--t1)]">M-Pesa collections — 2025</div>
                            <div className="text-[10px] text-[var(--t3)] font-medium mt-1">Actual vs projection vs target corridor</div>
                        </div>
                        <div className="text-[12px] font-semibold text-[var(--green)]">KES 103M Forecast</div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#27ae60" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#27ae60" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--p-line)" vertical={false} />
                            <XAxis dataKey="month" stroke="var(--t4)" fontSize={9} axisLine={false} tickLine={false} />
                            <YAxis stroke="var(--t4)" fontSize={9} axisLine={false} tickLine={false} />
                            <RechartsTooltip 
                                contentStyle={{ background: 'var(--sidebar)', border: '1px solid var(--p-line)', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '10px', fontWeight: 'semibold' }}
                                labelStyle={{ fontSize: '10px', color: 'var(--t4)', marginBottom: '4px' }}
                            />
                            <Area type="monotone" dataKey="actual" stroke="#27ae60" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                            <Area type="monotone" dataKey="projection" stroke="#27ae60" strokeDasharray="5 5" fill="transparent" strokeOpacity={0.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Runway Timeline */}
                <div className="col-span-12 lg:col-span-4 glass-card p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="text-[13px] font-semibold text-[var(--t1)]">Revenue runway</div>
                            <div className="text-[10px] text-[var(--t3)] font-medium mt-1">AI growth projection</div>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 bg-[var(--p-dim)] rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--p)] animate-pulse" />
                            <span className="text-[9px] font-semibold text-[var(--p)]">Live</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { step: '01', label: 'Today', val: '28,416', sub: 'KES 87.4M / month', fill: '88%', color: 'var(--p)' },
                            { step: '02', label: '+2 Months', val: '30,616', sub: 'KES 94M / month', fill: '92%', color: 'var(--green)' },
                            { step: '03', label: '+4.4 Months', val: '33,240', sub: 'KES 102M / month', fill: '100%', color: 'var(--green)' },
                            { step: '04', label: 'Dec 2025 target', val: '38,000', sub: 'KES 120M stretch', fill: '75%', color: 'var(--amber)' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-semibold shrink-0" style={{ background: item.color, color: 'var(--sidebar)' }}>{item.step}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-1">
                                        <div className="text-[9px] font-semibold text-[var(--t4)]">{item.label}</div>
                                        <div className="text-[11px] font-semibold text-[var(--t1)]">{item.val}</div>
                                    </div>
                                    <div className="text-[9px] text-[var(--t3)] font-medium mb-2">{item.sub}</div>
                                    <div className="h-1 bg-[var(--p-line)] rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: item.fill }} transition={{ duration: 1, delay: i * 0.2 }} className="h-full rounded-full" style={{ background: item.color }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── TRANSACTION STREAM & ZAP FORM ── */}
            <div className="grid grid-cols-12 gap-3">
                {/* Zap Form */}
                <div className="col-span-12 lg:col-span-4 glass-card p-5">
                    <div className="mb-6">
                        <div className="text-[13px] font-semibold text-[var(--t1)]">Quick disbursement</div>
                        <div className="text-[10px] text-[var(--t3)] font-medium mt-1">Initiate instant M-Pesa payment</div>
                    </div>
                    <form onSubmit={handleInitiateZap} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-semibold text-[var(--t4)] mb-1.5 ml-1">Phone number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--t4)]" />
                                <input
                                    type="text"
                                    placeholder="2547XXXXXXXX"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full bg-[var(--sidebar)] border border-[var(--p-line)] rounded-xl py-2.5 pl-10 pr-4 text-[11px] text-[var(--t1)] focus:outline-none focus:border-[var(--p)] transition-all font-mono"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-[var(--t4)] mb-1.5 ml-1">Amount (KES)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--t4)]" />
                                <input
                                    type="number"
                                    placeholder="Min 10 - Max 100,000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-[var(--sidebar)] border border-[var(--p-line)] rounded-xl py-2.5 pl-10 pr-4 text-[11px] text-[var(--t1)] focus:outline-none focus:border-[var(--p)] transition-all font-mono"
                                />
                            </div>
                        </div>
                        <button type="submit" className="f-btn shimmer w-full py-3 flex items-center justify-center gap-2 text-[11px] font-semibold">
                            <Zap className="w-4 h-4 fill-current" />
                            Send payment
                        </button>
                    </form>
                    <div className="mt-6 p-4 rounded-xl bg-[var(--p-dim)] border border-[var(--p-line)] flex gap-3">
                        <ShieldCheck className="w-5 h-5 text-[var(--p)] shrink-0" />
                        <p className="text-[10px] text-[var(--t3)] leading-relaxed font-medium">
                            <span className="font-semibold text-[var(--p)]">Secure tunnel:</span> All disbursements are encrypted and require biometric or email confirmation.
                        </p>
                    </div>
                </div>

                {/* Live Stream */}
                <div className="col-span-12 lg:col-span-8 glass-card overflow-hidden flex flex-col h-[480px]">
                    <div className="p-5 border-b border-[var(--p-line)] flex items-center justify-between">
                        <div>
                            <div className="text-[13px] font-semibold text-[var(--t1)]">Transaction live stream</div>
                            <div className="text-[10px] text-[var(--t3)] font-medium mt-1">Real-time disbursement logs</div>
                        </div>
                        <div className="text-[10px] font-medium text-[var(--t4)]">Rolling 24h window</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-[var(--p-line)]">
                        {callbacks.map((log) => (
                            <div key={log.id} className="group flex items-center justify-between p-3 rounded-xl border border-[var(--p-line)] bg-[var(--glass)] hover:bg-[var(--glass-h)] transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                        log.result_code === 0 ? 'bg-[var(--green-d)] text-[var(--green)]' : 'bg-[var(--red-d)] text-[var(--red)]'
                                    }`}>
                                        {log.result_code === 0 ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-semibold text-[var(--t1)]">{log.employee_name || 'System disbursement'}</div>
                                        <div className="text-[9px] text-[var(--t4)] font-mono mt-0.5">{log.transaction_id || 'ID_PENDING'}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[12px] font-semibold text-[var(--t1)]">KES {(log.amount ?? 0).toLocaleString()}</div>
                                    <div className="text-[9px] text-[var(--t3)] font-medium mt-0.5">
                                        {log.callback_date ? new Date(log.callback_date).toLocaleTimeString() : 'Waiting...'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[var(--sidebar)]/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[var(--sidebar)] border border-[var(--p-line)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-8">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-[var(--amber-d)] flex items-center justify-center text-[var(--amber)] mb-4 border border-[var(--amber-glow)] animate-pulse">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <h2 className="text-[20px] font-semibold text-[var(--t1)]">Authorize payment</h2>
                                <p className="text-[11px] text-[var(--t3)] font-medium mt-2 leading-relaxed">
                                    You are initiating a payment of <span className="text-[var(--p)] font-semibold">KES {Number(amount).toLocaleString()}</span> to <span className="text-[var(--t1)] font-semibold">{phoneNumber}</span>.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Confirm admin email"
                                    value={confirmEmail}
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                    className="w-full bg-[var(--card)] border border-[var(--p-line)] rounded-xl py-3 px-4 text-[11px] text-[var(--t1)] focus:outline-none focus:border-[var(--p)] transition-all text-center"
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 text-[11px] font-semibold text-[var(--t4)] hover:text-[var(--t1)] transition-colors">Abort</button>
                                    <button onClick={handleConfirmSend} className="f-btn flex-1 py-3 text-[11px] font-semibold">Confirm</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MpesaZapPortal;
