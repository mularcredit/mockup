import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, X, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        setIsValidating(true);
        const params = new URLSearchParams(window.location.search || window.location.hash.replace('#', '?'));
        if (params.get('preview') === 'true') {
          setIsValidSession(true);
        } else {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsValidSession(true);
          } else {
            const code = params.get('code');
            if (code) {
              const { data, error } = await supabase.auth.exchangeCodeForSession(code);
              if (!error && data.session) setIsValidSession(true);
            }
          }
        }
      } catch (err) {
        console.error('Validation error:', err);
      } finally {
        setIsValidating(false);
      }
    };
    validateAccess();
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (!Object.values(passwordStrength).every(v => v)) { toast.error('Please fulfill all security requirements'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { toast.error(error.message); }
      else {
        sessionStorage.removeItem('isPasswordRecovery');
        setIsSuccess(true);
        supabase.auth.signOut().catch(() => { });
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const validate = (pwd: string) => {
    setPasswordStrength({
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--page)] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-md w-full text-center border border-[var(--p-line)]"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[var(--p-dim)] rounded-2xl flex items-center justify-center border border-[var(--p-line)]">
              <CheckCircle2 className="h-10 w-10 text-[var(--p)]" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-[var(--t1)] mb-2 tracking-tight">Access restored</h1>
          <p className="text-xs text-[var(--t3)] mb-8 font-medium">Security protocol complete. You may now log in with your new password.</p>
          <button
            onClick={() => navigate('/login')}
            className="f-btn w-full !bg-[var(--p)] !text-[var(--sidebar)] shadow-[0_4px_12px_var(--p-glow)]"
          >
            Authorize login
          </button>
        </motion.div>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-[var(--page)] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-[var(--p)] mb-4 shadow-[0_0_15px_var(--p-glow)]" />
        <p className="text-xs font-medium text-[var(--t3)] animate-blink">Validating encryption key...</p>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-[var(--page)] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 max-w-md w-full text-center border border-[var(--p-line)]"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[var(--red-d)] rounded-2xl flex items-center justify-center border border-[var(--red-glow)]">
              <X className="h-10 w-10 text-[var(--red)]" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-[var(--t1)] mb-2 uppercase tracking-tight">Segment <span className="text-[var(--red)]">Fault</span></h2>
          <p className="text-xs text-[var(--t4)] mb-8 font-mono uppercase tracking-widest">SECURITY_LINK_EXPIRED_OR_REVOKED</p>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 mx-auto text-[11px] font-bold text-[var(--p)] uppercase tracking-widest hover:text-[var(--green)] transition-all"
          >
            <ArrowLeft size={16} /> RETURN_TO_ENTRY
          </button>
        </motion.div>
      </div>
    );
  }

  const allMet = Object.values(passwordStrength).every(v => v);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-screen bg-[var(--page)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-md w-full border border-[var(--p-line)] shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--p-dim)] flex items-center justify-center border border-[var(--p-line)] relative group">
              <Lock className="h-7 w-7 text-[var(--p)] transition-transform group-hover:scale-110" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--sidebar)] border border-[var(--p-line)] rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-[var(--p)]" />
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-[var(--t1)] tracking-tight">Reset your password</h2>
          <p className="text-xs text-[var(--t4)] font-medium mt-1">Please enter your new secure password below</p>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-xs font-medium text-[var(--t3)] mb-1.5 pl-0.5">New password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-3 bg-[var(--glass)] border border-[var(--p-line)] rounded-xl text-sm text-[var(--t1)] focus:border-[var(--p)] outline-none transition-all placeholder-[var(--t4)]"
              value={password}
              autoFocus
              onChange={(e) => { setPassword(e.target.value); validate(e.target.value); }}
              required
            />
          </div>

          {/* Strength checker */}
          {password.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-[var(--sidebar)]/50 rounded-xl border border-[var(--p-line)] space-y-2.5"
            >
              <p className="text-[10px] font-semibold text-[var(--t4)] mb-1 opacity-60">Security requirements:</p>
              <CheckRow met={passwordStrength.minLength} label="At least 8 characters" />
              <CheckRow met={passwordStrength.hasUppercase} label="At least one uppercase letter [A-Z]" />
              <CheckRow met={passwordStrength.hasLowercase} label="At least one lowercase letter [a-z]" />
              <CheckRow met={passwordStrength.hasNumber} label="At least one number [0-9]" />
              <CheckRow met={passwordStrength.hasSpecial} label="At least one special character [!@#...]" />
            </motion.div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-[var(--t3)] mb-1.5 pl-0.5">Confirm password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className={`w-full px-4 py-3 bg-[var(--glass)] border rounded-xl text-sm text-[var(--t1)] outline-none transition-all placeholder-[var(--t4)] ${
                passwordsMatch
                  ? 'border-[var(--p)] focus:ring-[var(--p-glow)]'
                  : confirmPassword && !passwordsMatch
                  ? 'border-[var(--red)] focus:ring-[var(--red-glow)]'
                  : 'border-[var(--p-line)] focus:border-[var(--p)]'
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword.length > 0 && (
              <p className={`text-[10px] font-medium mt-2 flex items-center gap-1.5 ${passwordsMatch ? 'text-[var(--p)]' : 'text-[var(--red)]'}`}>
                {passwordsMatch ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !allMet || !passwordsMatch}
            className="f-btn w-full !bg-[var(--p)] !text-[var(--sidebar)] shadow-[0_4px_12px_var(--p-glow)] disabled:opacity-20 disabled:grayscale transition-all mt-2"
          >
            {loading ? 'Saving password...' : 'Save password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const CheckRow = ({ met, label }: { met: boolean; label: string }) => (
  <div className={`flex items-center gap-3 text-[10px] font-medium ${met ? 'text-[var(--p)]' : 'text-[var(--t4)] opacity-40'}`}>
    {met
      ? <div className="w-3.5 h-3.5 rounded-md bg-[var(--p-dim)] flex items-center justify-center border border-[var(--p-line)]"><Check size={10} className="text-[var(--p)]" /></div>
      : <div className="w-3.5 h-3.5 rounded-md border border-[var(--p-line)] flex-shrink-0" />}
    {label}
  </div>
);

export default UpdatePasswordPage;