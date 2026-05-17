import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, X, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
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
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidSession(true);
        } else {
          const params = new URLSearchParams(window.location.search || window.location.hash.replace('#', '?'));
          const code = params.get('code');
          if (code) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error && data.session) setIsValidSession(true);
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
            <div className="w-20 h-20 bg-[var(--green-d)] rounded-2xl flex items-center justify-center border border-[var(--green-glow)]">
              <CheckCircle2 className="h-10 w-10 text-[var(--green)]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[var(--t1)] mb-2 uppercase tracking-tight">Access <span className="text-[var(--p)]">Restored</span></h1>
          <p className="text-xs text-[var(--t3)] mb-8 font-mono uppercase tracking-widest">SECURITY_PROTOCOL_COMPLETE_SIGN_IN_PROCEED</p>
          <button
            onClick={() => navigate('/login')}
            className="f-btn w-full !bg-[var(--p)] !text-[var(--sidebar)] shadow-[0_4px_15px_var(--p-glow)]"
          >
            AUTHORIZE_LOGIN
          </button>
        </motion.div>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-[var(--page)] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-[var(--p)] mb-4 shadow-[0_0_15px_var(--p-glow)]" />
        <p className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-[0.3em] animate-blink">VALIDATING_ENCRYPTION_KEY...</p>
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
                <ShieldCheck className="w-3 h-3 text-[var(--green)]" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--t1)] tracking-tight uppercase">Rotate <span className="text-[var(--p)]">Keys</span></h2>
          <p className="text-[10px] text-[var(--t4)] font-mono uppercase tracking-widest mt-1.5">OVERWRITE_SECURITY_LAYER</p>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--t4)] uppercase tracking-[0.2em] mb-2 pl-1">New Cyber-Key</label>
            <input
              type="password"
              placeholder="ENCRYPT_NEW_PASSWORD..."
              className="w-full px-4 py-3 bg-[var(--glass)] border border-[var(--p-line)] rounded-xl text-sm text-[var(--t1)] focus:border-[var(--p)] outline-none transition-all placeholder-[var(--t4)] font-mono"
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
              <p className="text-[9px] font-bold text-[var(--t4)] uppercase tracking-widest mb-1 opacity-60">Validation Metrics:</p>
              <CheckRow met={passwordStrength.minLength} label="Length >= 0x08" />
              <CheckRow met={passwordStrength.hasUppercase} label="Bitmask Uppercase [A-Z]" />
              <CheckRow met={passwordStrength.hasLowercase} label="Bitmask Lowercase [a-z]" />
              <CheckRow met={passwordStrength.hasNumber} label="Bitmask Numeric [0-9]" />
              <CheckRow met={passwordStrength.hasSpecial} label="Entropy Symbol [!@#...]" />
            </motion.div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--t4)] uppercase tracking-[0.2em] mb-2 pl-1">Verify Key-Match</label>
            <input
              type="password"
              placeholder="CONFIRM_ENCRYPTION..."
              className={`w-full px-4 py-3 bg-[var(--glass)] border rounded-xl text-sm text-[var(--t1)] outline-none transition-all placeholder-[var(--t4)] font-mono ${
                passwordsMatch
                  ? 'border-[var(--green)] focus:ring-[var(--green-glow)]'
                  : confirmPassword && !passwordsMatch
                  ? 'border-[var(--red)] focus:ring-[var(--red-glow)]'
                  : 'border-[var(--p-line)] focus:border-[var(--p)]'
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword.length > 0 && (
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5 ${passwordsMatch ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                {passwordsMatch ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {passwordsMatch ? 'Keys Synchronized' : 'Bit-Mismatch Detected'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !allMet || !passwordsMatch}
            className="f-btn w-full !bg-[var(--p)] !text-[var(--sidebar)] shadow-[0_4px_15px_var(--p-glow)] disabled:opacity-20 disabled:grayscale transition-all mt-2"
          >
            {loading ? 'WRITING_TO_CORE...' : 'COMMIT_NEW_KEY'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const CheckRow = ({ met, label }: { met: boolean; label: string }) => (
  <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider ${met ? 'text-[var(--green)]' : 'text-[var(--t4)] opacity-40'}`}>
    {met
      ? <div className="w-3.5 h-3.5 rounded-md bg-[var(--green-d)] flex items-center justify-center border border-[var(--green-glow)]"><Check size={10} className="text-[var(--green)]" /></div>
      : <div className="w-3.5 h-3.5 rounded-md border border-[var(--p-line)] flex-shrink-0" />}
    {label}
  </div>
);

export default UpdatePasswordPage;