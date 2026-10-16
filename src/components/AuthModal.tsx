import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Globe,
  Building,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Key,
  AlertCircle,
} from 'lucide-react';
import { authService } from '../services/AuthService';
import { UserAccount } from '../types/auth';
import { PasswordGeneratorBox } from './PasswordGeneratorBox';
import { CeoPortrait } from './CeoPortrait';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup' | 'forgot';
  onSuccess?: (user: UserAccount) => void;
  redirectRoute?: string;
  navigate?: (route: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
  redirectRoute,
  navigate,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(defaultMode);

  // Common form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Bahrain');
  const [companyName, setCompanyName] = useState('');
  const [accountType, setAccountType] = useState<'INVESTOR' | 'CORPORATE' | 'STARTUP'>('INVESTOR');
  const [showGenerator, setShowGenerator] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const passwordStrength = authService.calculateStrength(password);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = authService.login(email, password);
      setIsLoading(false);

      if (!result.success || !result.session) {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      setSuccessMessage(`Welcome back, ${result.session.user.name}!`);
      if (onSuccess) {
        onSuccess(result.session.user);
      }

      setTimeout(() => {
        onClose();
        if (navigate) {
          const userRole = result.session?.user.role;
          if (userRole === 'CEO') {
            navigate('ceo');
          } else if (userRole === 'ADMIN') {
            navigate('admin');
          } else if (userRole === 'AGENT' || userRole === 'STAFF') {
            navigate('live-agent');
          } else {
            navigate('portal');
          }
        }
      }, 700);
    }, 400);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please complete all required fields (Name, Email, Password).');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = authService.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+973 3562 8353',
        country: country.trim(),
        passwordPlain: password,
        companyName: companyName.trim() || undefined,
        accountType,
      });
      setIsLoading(false);

      if (!result.success || !result.session) {
        setErrorMessage(result.error || 'Registration failed.');
        return;
      }

      setSuccessMessage(`Account created successfully! Welcome, ${result.session.user.name}.`);
      if (onSuccess) {
        onSuccess(result.session.user);
      }

      setTimeout(() => {
        onClose();
        if (navigate) {
          navigate('portal');
        }
      }, 800);
    }, 500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please provide your registered corporate email.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        `If an account exists for ${email}, a password reset link has been dispatched to your inbox.`
      );
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#14141d] border-2 border-[#e8c872]/50 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-[0_0_60px_rgba(232,200,114,0.18)] my-auto animate-in zoom-in-95 duration-200 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a8a7b3] hover:text-white p-2 rounded-full bg-[#0a0a0f] border border-[#2a2a38] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="mb-6 pb-4 border-b border-[#2a2a38]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#e8c872] mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bab Al-Khaleej & Back for Brand LLC · Sovereign Auth</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            {mode === 'login' && 'Sign In to Your Client Account'}
            {mode === 'signup' && 'Create Investor / Enterprise Account'}
            {mode === 'forgot' && 'Reset Account Password'}
          </h2>
          <p className="text-xs text-[#a8a7b3] mt-0.5">
            Access your active commercial registrations, investor visas, payment invoices, and advisory documents.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center rounded-xl bg-[#0a0a0f] p-1 border border-[#2a2a38] mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
                : 'text-[#a8a7b3] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
                : 'text-[#a8a7b3] hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Feedback Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LOGIN FORM                                                                */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#a8a7b3] mb-1">
                Corporate Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g., ghazi@backforbrand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                />
                <Mail className="w-4 h-4 text-[#a8a7b3] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#a8a7b3]">
                  Password <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#e8c872] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                />
                <Lock className="w-4 h-4 text-[#a8a7b3] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#a8a7b3] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {navigate && (
              <div className="pt-3 border-t border-[#2a2a38] flex items-center justify-between text-[11px] text-[#888]">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('admin/login');
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Admin Console →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('ceo/login');
                  }}
                  className="hover:text-[#e8c872] transition-colors cursor-pointer"
                >
                  CEO Cockpit →
                </button>
              </div>
            )}
          </form>
        )}

        {/* ========================================================================= */}
        {/* SIGNUP FORM                                                               */}
        {/* ========================================================================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#a8a7b3] mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Mansoor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                  />
                  <User className="w-4 h-4 text-[#a8a7b3] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a8a7b3] mb-1">
                  Corporate Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                  />
                  <Mail className="w-4 h-4 text-[#a8a7b3] absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#a8a7b3] mb-1">
                  WhatsApp / Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+973 3562 8353"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                  />
                  <Phone className="w-4 h-4 text-[#a8a7b3] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a8a7b3] mb-1">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e: any) => setAccountType(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                >
                  <option value="INVESTOR">Foreign Investor / Founder</option>
                  <option value="CORPORATE">Bahrain Enterprise (W.L.L.)</option>
                  <option value="STARTUP">Tech Startup / AI Scaleup</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#a8a7b3]">
                  Account Password <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowGenerator(!showGenerator)}
                  className="text-[11px] text-[#e8c872] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Key className="w-3 h-3" />
                  <span>{showGenerator ? 'Close Password Tool' : 'Generate Strong Password'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                />
                <Lock className="w-4 h-4 text-[#a8a7b3] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#a8a7b3] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#a8a7b3]">Entropy Rating:</span>
                    <span className="font-bold" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className="h-full flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor:
                            step <= passwordStrength.score ? passwordStrength.color : '#2a2a38',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Embedded Strong Password Generator Box */}
            {showGenerator && (
              <PasswordGeneratorBox
                onSelectPassword={(pwd) => {
                  setPassword(pwd);
                  setShowGenerator(false);
                }}
              />
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
            >
              {isLoading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account & Access Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* FORGOT PASSWORD FORM                                                      */}
        {/* ========================================================================= */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#a8a7b3] mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. ghazi@backforbrand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                />
                <Mail className="w-4 h-4 text-[#a8a7b3] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
            >
              {isLoading ? <span>Sending Reset Link...</span> : <span>Send Password Reset Instructions</span>}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#e8c872] hover:underline cursor-pointer"
              >
                &larr; Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
