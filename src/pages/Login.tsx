import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAppUpdate } from '../sw';
import { 
    CircleNotch,
    CheckCircle,
    X,
    Quotes
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import './Login.css';

interface LoginProps {
    onLoginSuccess: (userData: any) => void;
}

interface Branch {
    Town: string;
}

interface SuccessPopupProps {
    show: boolean;
    onClose: () => void;
    message: string;
}

function SuccessPopup({ show, onClose, message }: SuccessPopupProps) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#08120D] border border-[#00E5FF] p-10 max-w-sm w-full text-center rounded-2xl shadow-[0_0_40px_rgba(0, 229, 255,0.1)]"
            >
                <div className="w-16 h-16 bg-[rgba(29,158,117,0.1)] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#1D9E75]">
                    <CheckCircle size={32} className="text-[#1D9E75]" weight="fill" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Request Sent</h3>
                <p className="text-white/60 text-[12px] mb-8 font-medium leading-relaxed">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-[#00E5FF] text-[#07080d] rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                    Got it
                </button>
            </motion.div>
        </div>
    );
}

export default function Login({ onLoginSuccess }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isFetchingBranches, setIsFetchingBranches] = useState(false);
    const [isBranchAutoPopulated, setIsBranchAutoPopulated] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light'));

    // Theme detection for logo
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsLightMode(document.body.classList.contains('light'));
                }
            });
        });

        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, []);
    
    const navigate = useNavigate();
    const { checkForUpdates } = useAppUpdate();

    const ADMIN_EMAILS = [
        'admin@mularcredit.co.ke',
        'checker@mularcredit.com',
        'hr@mularcredit.co.ke',
        'it@mularcredit.co.ke',
        'hr@zira.com',
        'olivia.hr@mularcredit.com',
        'daniel.admin@mularcredit.com',
        'checker.superadmin@mularcredit.com',
        'titus1admin@mularcredit.co.ke',
        'ian3admin@mularcredit.co.ke',
        'collins2admin@mularcredit.co.ke',
        'zira@zira.io',
        'admin@malicash.co'
    ];

    const isAdminEmail = (email: string) => ADMIN_EMAILS.includes(email.toLowerCase());

    useEffect(() => {
        toast.dismiss();
        checkForUpdates();
    }, [checkForUpdates]);

    useEffect(() => {
        const fetchTowns = async () => {
            try {
                const { data, error } = await supabase
                    .from('kenya_branches_duplicate')
                    .select('Town')
                    .order('Town', { ascending: true });
                if (error) throw error;
                setBranches(data || []);
            } catch (error) {
                console.error('Failed to load towns');
            }
        };
        fetchTowns();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            const { data: userData } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (userData) {
                if (userData.account_status && userData.account_status !== 'ACTIVE') {
                    await supabase.auth.signOut();
                    toast.error(`Your account is ${userData.account_status.toLowerCase()}. Please contact support.`);
                    setLoading(false);
                    return;
                }
                onLoginSuccess(userData);
            }
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleStaffSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('staff_signup_requests')
                .insert([{
                    email,
                    branch: isAdminEmail(email) ? 'HEAD_OFFICE' : selectedBranch,
                    status: 'pending'
                }]);
            if (error) throw error;
            setShowSuccessPopup(true);
            setEmail('');
            setSelectedBranch('');
        } catch (error: any) {
            toast.error(error.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const targetEmail = showForgotPassword ? resetEmail : email;
        
        if (!targetEmail) {
            toast.error('Please enter your work email first');
            return;
        }

        setResetLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
                redirectTo: `${window.location.origin}/update-password`,
            });
            if (error) throw error;
            toast.success(`Password reset link sent to ${targetEmail}`);
            setShowForgotPassword(false);
            setResetEmail('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset link');
        } finally {
            setResetLoading(false);
        }
    };

    // Restore Branch Lookup Logic (Git Restored)
    useEffect(() => {
        const fetchBranchForEmail = async () => {
            if (!isSignUp && email && email.includes('@') && email.length > 5) {
                setIsFetchingBranches(true);
                try {
                    if (isAdminEmail(email)) {
                        setSelectedBranch('');
                        setIsBranchAutoPopulated(false);
                        return;
                    }

                    const { data, error } = await supabase
                        .from('users')
                        .select('branch')
                        .eq('email', email.toLowerCase())
                        .maybeSingle();

                    if (data && data.branch) {
                        setSelectedBranch(data.branch);
                        setIsBranchAutoPopulated(true);
                    } else {
                        setSelectedBranch('');
                        setIsBranchAutoPopulated(false);
                    }
                } catch (err) {
                    console.error('Error fetching branch:', err);
                    setSelectedBranch('');
                    setIsBranchAutoPopulated(false);
                } finally {
                    setIsFetchingBranches(false);
                }
            } else {
                setIsBranchAutoPopulated(false);
            }
        };

        const debounceTimer = setTimeout(fetchBranchForEmail, 500);
        return () => clearTimeout(debounceTimer);
    }, [email, isSignUp]);

    return (
        <div className="login-viewport">
            {/* LEFT COLUMN */}
            <div className="login-left-pane">
                <div className="bg-engine">
                    <div className="bg-fill"></div>
                    <div className="bg-ambient"></div>
                    <div className="bg-custom-grid"></div>
                    {/* Curved Pattern Layer Removed */}
                </div>

                {/* LEFT LOGO */}
                <div className="login-logo-left">
                    <img 
                        src="/ZIRA.png" 
                        alt="ZiraHR" 
                        className="login-logo-main"
                    />
                </div>



                {/* BOTTOM CONTENT */}
                <div className="left-content-wrapper">
                    <h1 className="headline-ultra-thin">
                        Your people.<br />
                        Your <strong>growth.</strong><br />
                        One platform.
                    </h1>

                    <p className="subtext-light">
                        Streamline payroll, manage branch operations, and oversee employee lifecycles through a secure, high-performance platform built for scale.
                    </p>

                    <div className="left-stat-row">
                        {[['678+', 'Employees'], ['48', 'Branches'], ['99%', 'Uptime']].map(([val, label]) => (
                            <div key={label}>
                                <div className="left-stat-val">{val}</div>
                                <div className="left-stat-lbl">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="login-right-pane">
                {/* RIGHT LOGO */}
                <div className="login-logo-right">
                    <img 
                        src="/zira-dark.png" 
                        alt="ZiraHR" 
                        className="login-logo-main"
                    />
                </div>
                <div className="w-full max-w-[420px] mx-auto relative z-10">
                    <div className="form-eyebrow-section">
                        <div className="eyebrow-hairline"></div>
                        <span className="eyebrow-title">Secure access</span>
                    </div>

                    <h2 className="form-title-h1">{isSignUp ? 'Request Access' : 'Welcome back'}</h2>
                    <p className="form-subtext-p">
                        {isSignUp 
                            ? 'Enter your professional details to request system access.'
                            : 'Sign in to your ZiraHR workspace.'
                        }
                    </p>

                    <form onSubmit={isSignUp ? handleStaffSignUp : handleLogin}>
                        {/* FIELD 1 — Work email */}
                        <div className="label-container">Work email</div>
                        <div className="input-group-relative">
                            <i className="ti-mail input-icon-l-side"></i>
                            <input 
                                type="email" 
                                className="input-main-ctrl"
                                placeholder="you@zira.io"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {!isSignUp && (
                            <div className="label-container">
                                <span>Password</span>
                                <span 
                                    className="label-link-aqua"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Forgot password?
                                </span>
                            </div>
                        )}
                        {!isSignUp && (
                            <div className="input-group-relative">
                                <i className="ti-lock input-icon-l-side"></i>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="input-main-ctrl"
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <i 
                                    className={`ti-eye input-icon-r-side`} 
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                        )}

                        {/* FIELD 3 — Branch */}
                        {(isSignUp || !isAdminEmail(email)) && (
                            <>
                                <div className="label-container">
                                    <span>Branch</span>
                                    {isBranchAutoPopulated && !isSignUp && (
                                        <span className="text-[9px] text-[#1D9E75] font-bold uppercase tracking-wider bg-[#1D9E75]/10 px-1.5 py-0.5 rounded border border-[#1D9E75]/20 animate-pulse">
                                            Auto-populated
                                        </span>
                                    )}
                                    {isFetchingBranches && (
                                        <CircleNotch className="w-3 h-3 animate-spin text-[#00E5FF]/40" />
                                    )}
                                </div>
                                <div className="input-group-relative">
                                    <i className="ti-building input-icon-l-side"></i>
                                    <select 
                                        className="input-main-ctrl"
                                        value={selectedBranch}
                                        onChange={(e) => {
                                            setSelectedBranch(e.target.value);
                                            if (!isSignUp) setIsBranchAutoPopulated(false);
                                        }}
                                        required
                                    >
                                        <option value="" disabled>Select your branch...</option>
                                        <option value="Nairobi HQ">Nairobi HQ</option>
                                        <option value="Mombasa">Mombasa</option>
                                        <option value="Kisumu">Kisumu</option>
                                        <option value="Nakuru">Nakuru</option>
                                        {branches.map((b, i) => (
                                            <option key={i} value={b.Town}>{b.Town}</option>
                                        ))}
                                    </select>
                                    <i className="ti-chevron-down input-icon-r-side pointer-events-none"></i>
                                </div>
                            </>
                        )}

                        {/* SUBMIT BUTTON */}
                        <button type="submit" className="btn-login-main" disabled={loading}>
                            {loading ? (
                                <CircleNotch className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? 'Submit request' : 'Sign in'}
                                    <i className="ti-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="divider-box">
                        <div className="divider-line"></div>
                        <span className="divider-text">or</span>
                        <div className="divider-line"></div>
                    </div>

                    <div className="form-footer-bottom">
                        {isSignUp ? 'Already have an account? ' : 'No account? '}
                        <span 
                            className="footer-link-aqua"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? 'Login now' : 'Request access'}
                        </span>
                    </div>
                </div>
            </div>

            <SuccessPopup
                show={showSuccessPopup}
                onClose={() => {
                    setShowSuccessPopup(false);
                    setIsSignUp(false);
                }}
                message="Your request has been submitted successfully. Our HR team will review your credentials for approval."
            />

            {/* FORGOT PASSWORD MODAL — Ambient Horizon Style */}
            <AnimatePresence>
                {showForgotPassword && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#08120D] border border-[#00E5FF] p-8 max-w-md w-full rounded-2xl shadow-[0_0_50px_rgba(0, 229, 255,0.15)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <button 
                                    onClick={() => setShowForgotPassword(false)}
                                    className="text-white/30 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="w-12 h-12 bg-[rgba(0, 229, 255,0.1)] rounded-xl flex items-center justify-center mb-4 border border-[#00E5FF]/20">
                                    <i className="ti-lock text-[#00E5FF] text-xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Reset Password</h3>
                                <p className="text-white/50 text-xs leading-relaxed">
                                    Enter your registered work email address below to receive a secure password reset link.
                                </p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div>
                                    <div className="label-container">Work email</div>
                                    <div className="input-group-relative">
                                        <i className="ti-mail input-icon-l-side"></i>
                                        <input 
                                            type="email" 
                                            className="input-main-ctrl"
                                            placeholder="you@zira.io"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(false)}
                                        className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-xs font-medium text-white/60 hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="flex-1 py-3 px-4 bg-[#00E5FF] text-[#07080d] rounded-xl text-xs font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        {resetLoading ? (
                                            <CircleNotch className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Send link'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}