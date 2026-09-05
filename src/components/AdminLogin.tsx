import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  ChefHat,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '../utils/security';
import { authApi } from '../utils/api';

interface AdminLoginProps {
  onLoginSuccess: (email: string) => void;
  onCancel: () => void;
  allowedEmail: string;
  adminPasscodeHash: string;
  adminPasscodeSalt: string;
  legacyPasscode?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onCancel,
  allowedEmail,
  adminPasscodeHash,
  adminPasscodeSalt,
  legacyPasscode,
}) => {
  const [emailInput, setEmailInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [noticeMsg, setNoticeMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Check initial rate limit status
  useEffect(() => {
    const status = checkRateLimit();
    if (!status.allowed && status.retryAfterSeconds > 0) {
      setLockoutSeconds(status.retryAfterSeconds);
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setNoticeMsg('');

    // Check rate limit
    const rateLimitStatus = checkRateLimit();
    if (!rateLimitStatus.allowed) {
      setLockoutSeconds(rateLimitStatus.retryAfterSeconds);
      setErrorMsg(`Security Lockout: Too many failed attempts. Please wait ${rateLimitStatus.retryAfterSeconds}s before retrying.`);
      return;
    }

    setIsLoading(true);

    try {
      const result = isRegistering
        ? await authApi.register(nameInput, emailInput, passwordInput)
        : await authApi.login(emailInput, passwordInput);
      resetRateLimit();
      const loggedInEmail = result.user.email;

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(loggedInEmail);
      }, 300);
    } catch (error) {
      setIsLoading(false);
      const message = error instanceof Error ? error.message : 'Unable to authenticate. Please try again.';
      const requiresConfirmation = isRegistering && /^Account created\./i.test(message);
      if (requiresConfirmation) {
        setIsRegistering(false);
        setPasswordInput('');
        setNoticeMsg('Your account was created. Check your email, confirm your address, then sign in with your password.');
        return;
      }
      const isEmailRateLimit = /rate limit|email.*limit|over_email_send_rate_limit/i.test(message);
      if (!isEmailRateLimit) {
        const failedAttempt = recordFailedAttempt();
        if (failedAttempt.retryAfterSeconds > 0) {
          setLockoutSeconds(failedAttempt.retryAfterSeconds);
        }
      }
      setErrorMsg(isEmailRateLimit
        ? 'Supabase has temporarily limited emails for this address. Wait before trying again, or use Sign In if the account already exists.'
        : message);
    }
  };

  return (
    <div
      id="admin-login-screen"
      className="min-h-[75vh] flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
    >
      <div className="bg-[#1f1a16] text-white max-w-5xl w-full rounded-[2rem] shadow-2xl border border-[#3e342c] relative overflow-hidden">
        {/* Glow styling */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#c85a32]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid md:grid-cols-[0.85fr_1.15fr]">
          <aside className="hidden md:flex flex-col justify-between bg-[#2b211b] p-10 border-r border-[#49372c]">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center shadow-lg shadow-[#c85a32]/20 mb-8">
                <ChefHat className="w-7 h-7" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e5835e] mb-3">Savor & Craft</p>
              <h2 className="font-serif-display text-4xl font-bold leading-tight text-white mb-5">
                Your kitchen,<br />your craft.
              </h2>
              <p className="text-sm leading-7 text-[#c9b9aa]">
                Save recipes, organize your cooking plans, and build confidence with practical guidance made for real kitchens.
              </p>
            </div>
            <div className="space-y-3 text-xs text-[#b5a79a]">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#52b788]" /> Personal recipe collection</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#52b788]" /> Smart grocery and meal tools</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#52b788]" /> Secure account access</div>
            </div>
          </aside>

          <div className="p-6 sm:p-10">

            {/* Back button */}
            <button
              onClick={onCancel}
              className="relative z-10 inline-flex items-center gap-1.5 text-xs text-[#a89b8e] hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Recipe Catalog</span>
            </button>

            {/* Header */}
            <div className="text-center relative z-10 space-y-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#c85a32] to-[#e0754d] text-white mx-auto flex items-center justify-center shadow-lg shadow-[#c85a32]/30 md:hidden">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e5835e] bg-[#c85a32]/20 px-3 py-1 rounded-full border border-[#c85a32]/40">
                  Welcome to SavorCraft
                </span>
                <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-white mt-2">
                  {isRegistering ? 'Create your account' : 'Welcome back'}
                </h1>
                <p className="text-xs text-[#b5a79a] mt-1.5 leading-relaxed">
                  {isRegistering
                    ? 'Join SavorCraft to save recipes and make your cooking routine easier.'
                    : 'Sign in to pick up where you left off and access your saved kitchen tools.'}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-semibold text-[#d4c6b8] mb-1.5">Full name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2a241f] border border-[#4a3e34] text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#c85a32] focus:border-transparent transition-all placeholder-[#736558]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#d4c6b8] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a7b6e] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    required
                    disabled={lockoutSeconds > 0}
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#2a241f] border border-[#4a3e34] text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#c85a32] focus:border-transparent transition-all placeholder-[#736558] disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#d4c6b8]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#8a7b6e] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutSeconds > 0}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder={isRegistering ? 'At least 8 characters...' : 'Enter password...'}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#2a241f] border border-[#4a3e34] text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#c85a32] focus:border-transparent transition-all placeholder-[#736558] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#8a7b6e] hover:text-white transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {lockoutSeconds > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-800 text-amber-200 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="leading-snug">
                    Security Cooldown active: Retry in <span className="font-bold font-mono">{lockoutSeconds}s</span>
                  </div>
                </div>
              )}

              {errorMsg && lockoutSeconds === 0 && (
                <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-snug">{errorMsg}</div>
                </div>
              )}

              {noticeMsg && lockoutSeconds === 0 && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-snug">{noticeMsg}</div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || lockoutSeconds > 0}
                  className="w-full py-3 rounded-xl bg-[#c85a32] hover:bg-[#b04a25] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c85a32]/25 active:scale-98 transition-all"
                >
                  {isLoading ? (
                    <span>Verifying Cryptographic Credentials...</span>
                  ) : lockoutSeconds > 0 ? (
                    <span>Locked ({lockoutSeconds}s)</span>
                  ) : (
                    <>
                      <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => { setIsRegistering((current) => !current); setErrorMsg(''); setNoticeMsg(''); }}
                className="w-full text-xs text-[#e5835e] hover:text-white transition-colors"
              >
                {isRegistering ? 'Already have an account? Sign in' : 'New user? Create an account'}
              </button>

            </form>

            <div className="mt-6 pt-4 border-t border-[#3e342c]/60 text-center relative z-10 flex items-center justify-center gap-2 text-[11px] text-[#857668]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#52b788]" />
              <span>Protected by secure authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
