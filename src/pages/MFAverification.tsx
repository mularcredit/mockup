import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleNotch, ShieldCheck, ArrowLeft, ArrowsClockwise, Quotes, Sun, Moon } from "@phosphor-icons/react";
import './Login.css';

interface MFAData {
  userId: string;
  email: string;
  userRole: string;
  branch: string;
  session: any;
}

const formatPhoneNumberForSMS = (phone: string): string => {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('7') && cleaned.length === 9) {
    cleaned = '254' + cleaned;
  } else if (cleaned.startsWith('254') && cleaned.length === 12) {
    // Keep as is
  } else if (cleaned.startsWith('+254') && cleaned.length === 13) {
    cleaned = cleaned.substring(1);
  }
  return cleaned.length === 12 && cleaned.startsWith('254') ? cleaned : phone;
};

export default function MFAVerification() {
  const [codes, setCodes] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
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

  const toggleTheme = () => {
    const next = !isLightMode;
    setIsLightMode(next);
    if (next) {
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasShownSessionError = useRef(false);
  const hasTriggeredInitialSend = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    sessionStorage.setItem('mfaInProgress', 'true');
    const handleBackButton = (event: PopStateEvent) => {
      if (!isVerified) {
        event.preventDefault();
        event.stopPropagation();
        toast.error('Please complete MFA verification first');
        window.history.pushState(null, '', window.location.href);
      }
    };
    window.addEventListener('popstate', handleBackButton);
    window.history.pushState(null, '', window.location.href);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
      if (!isVerified) sessionStorage.removeItem('mfaInProgress');
    };
  }, [isVerified]);

  useEffect(() => {
    const lockUntil = localStorage.getItem('mfaLockUntil');
    if (lockUntil && parseInt(lockUntil) > Date.now()) {
      setIsLocked(true);
      setLockTime(parseInt(lockUntil));
      return;
    }

    const mfaData = sessionStorage.getItem('mfaData');
    if (mfaData) {
      try {
        const parsedData: MFAData = JSON.parse(mfaData);
        setEmail(parsedData.email);
        setUserId(parsedData.userId);
        if (parsedData.session) supabase.auth.setSession(parsedData.session);
      } catch (error) {
        toast.error('Invalid session data');
        navigate('/login');
      }
    } else {
      const redirectEmail = searchParams.get('email');
      const redirectUserId = searchParams.get('userId');
      if (redirectEmail && redirectUserId) {
        setEmail(redirectEmail);
        setUserId(redirectUserId);
      } else {
        const initFromSession = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setEmail(session.user.email || '');
            setUserId(session.user.id);
            return true;
          }
          return false;
        };
        initFromSession().then((foundSession) => {
          if (!foundSession && !hasShownSessionError.current) {
            hasShownSessionError.current = true;
            supabase.auth.signOut().finally(() => {
              sessionStorage.removeItem('isMFAProcess');
              navigate('/login', { replace: true });
            });
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (userId && email && !isVerified && !loading && !resendLoading && !hasTriggeredInitialSend.current) {
      const sentFlag = `mfa_sent_${userId}`;
      const hasSentInitial = sessionStorage.getItem(sentFlag);
      if (!hasSentInitial) {
        hasTriggeredInitialSend.current = true;
        const timeoutId = setTimeout(() => {
          handleResendCode(true)
            .then(() => sessionStorage.setItem(sentFlag, 'true'))
            .catch(() => hasTriggeredInitialSend.current = false);
        }, 800);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [userId, email]);

  useEffect(() => {
    if (!isLocked) return;
    const interval = setInterval(() => {
      const remainingTime = lockTime - Date.now();
      if (remainingTime <= 0) {
        setIsLocked(false);
        localStorage.removeItem('mfaLockUntil');
        localStorage.removeItem('mfaAttemptCount');
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lockTime]);

  const handleCodeChange = (index: number, value: string) => {
    if (isLocked) return;
    if (!/^\d*$/.test(value)) return;
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newCodes.every(code => code !== '') && index === 5) handleVerification(newCodes.join(''));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    if (digits.length === 6) {
      const newCodes = [...codes];
      digits.forEach((digit, index) => { newCodes[index] = digit; });
      setCodes(newCodes);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerification = async (fullCode: string) => {
    if (isLocked) return;
    if (!fullCode || fullCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mfa_codes')
        .select('*')
        .eq('email', email)
        .eq('code', fullCode)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        await supabase.from('mfa_codes').update({ used: true }).eq('id', data.id);
        setIsVerified(true);
        sessionStorage.setItem('mfaVerified', 'true');
        sessionStorage.setItem('mfaCompleted', 'true');
        localStorage.removeItem('mfaAttemptCount');
        localStorage.removeItem('mfaLockUntil');
        toast.success('Verification successful!');
        setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
      } else {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        localStorage.setItem('mfaAttemptCount', newAttemptCount.toString());
        if (newAttemptCount >= 5) {
          const lockUntil = Date.now() + 5 * 60 * 1000;
          setIsLocked(true);
          setLockTime(lockUntil);
          localStorage.setItem('mfaLockUntil', lockUntil.toString());
          toast.error('Too many failed attempts. Locked for 5 minutes.');
        } else {
          toast.error(`Invalid code. ${5 - newAttemptCount} attempts remaining`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (isInitial = false) => {
    if (!isInitial && (isLocked || countdown > 0)) return;
    setResendLoading(true);
    try {
      const { data: numData, error: numError } = await supabase.from('mfa_numbers').select('phone_number').eq('email', email).single();
      if (numError || !numData?.phone_number) throw new Error('MFA phone number not found.');
      const formattedPhone = formatPhoneNumberForSMS(numData.phone_number);
      const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
      await supabase.from('mfa_codes').update({ used: true }).eq('email', email).eq('used', false);
      const { error: storeError } = await supabase.from('mfa_codes').insert({
        user_id: userId, email: email, code: mfaCode, phone_number: formattedPhone,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), used: false
      });
      if (storeError) throw storeError;
      const message = `Your ZiraHR verification code is: ${mfaCode}. Expires in 10 min.`;
      const url = `https://isms.celcomafrica.com/api/services/sendsms/?apikey=17323514aa8ce2613e358ee029e65d99&partnerID=928&message=${encodeURIComponent(message)}&shortcode=MularCredit&mobile=${formattedPhone}`;
      await fetch(url, { method: 'GET', mode: 'no-cors' });
      setCountdown(30);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => { if (prev <= 1) { clearInterval(countdownInterval); return 0; } return prev - 1; });
      }, 1000);
      toast.success('Verification code sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = () => {
    sessionStorage.clear();
    localStorage.removeItem('mfaLockUntil');
    supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  const formatTimeRemaining = () => {
    const seconds = Math.ceil((lockTime - Date.now()) / 1000);
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="login-viewport">
      {/* LEFT COLUMN */}
      <div className="login-left-pane">
        <div className="bg-engine">
          <div className="bg-fill"></div>
          <div className="bg-ambient"></div>
          <div className="bg-custom-grid"></div>
          <div className="bg-pattern-left-curve"></div>
        </div>

          {/* LEFT LOGO */}
          <div className="login-logo-left">
            <img 
              src="/ZIRA.png" 
              alt="ZiraHR" 
              className="login-logo-main"
            />
          </div>

          <div className="left-content-wrapper">
            <div className="atmospheric-content">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="headline-section">
                  <h1 className="headline-ultra-thin">
                    Your people. <br />
                    Your <strong>growth.</strong> <br />
                    One platform.
                  </h1>
                </div>

              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="login-right-pane">
          {/* RIGHT LOGO + THEME TOGGLE */}
          <div className="login-logo-right">
            <button
              onClick={toggleTheme}
              className="theme-toggle-auth"
              title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {isLightMode ? <Moon size={15} weight="fill" /> : <Sun size={15} weight="fill" />}
            </button>
            <img
              src="/zira-dark.png"
              alt="ZiraHR"
              className="login-logo-main"
            />
          </div>
          <div className="w-full max-w-[440px] relative z-10">
            <div className="form-eyebrow-section">
              <div className="eyebrow-hairline"></div>
              <span className="eyebrow-title">MFA Challenge</span>
            </div>

            <h1 className="headline-main">Verification Required</h1>
            <p className="subheadline-muted">
              We've sent a 6-digit security code to your registered device. Enter it below to complete your login.
            </p>

            {isLocked && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mfa-lockout-badge"
              >
                <ShieldCheck size={20} />
                <span>Security lockout: Try again in {formatTimeRemaining()}</span>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="mfa-otp-container">
                {codes.map((code, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={loading || isLocked}
                    className="mfa-otp-input"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <button
                onClick={() => handleVerification(codes.join(''))}
                disabled={loading || isLocked || codes.some(code => code === '')}
                className="btn-login-main flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <ArrowsClockwise className="animate-spin" size={18} />
                    <span>Verifying Secure Access Node...</span>
                  </>
                ) : (
                  <>
                    <span>Verify code</span>
                    <ShieldCheck size={18} />
                  </>
                )}
              </button>

              <div className="divider-box">
                <div className="divider-line"></div>
                <span className="divider-text">Actions</span>
                <div className="divider-line"></div>
              </div>

              <div className="mfa-action-row">
                <div 
                  className="mfa-link-action mfa-link-resend"
                  onClick={() => handleResendCode()}
                  style={{ opacity: (resendLoading || isLocked || countdown > 0) ? 0.4 : 1 }}
                >
                  <ArrowsClockwise className={resendLoading ? "animate-spin" : ""} size={16} />
                  <span>
                    {resendLoading ? 'Sending...' : countdown > 0 ? `Resend code in ${countdown}s` : 'Resend security code'}
                  </span>
                </div>

                <div 
                  className="mfa-link-action mfa-link-back"
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft size={16} />
                  <span>Return to login</span>
                </div>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}