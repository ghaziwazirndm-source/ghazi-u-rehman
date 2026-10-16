import React, { useState } from 'react';
import { Crown, Lock, Key, ArrowRight, AlertCircle, CheckCircle2, UserPlus, Eye, EyeOff, Sparkles } from 'lucide-react';
import { authService } from '../services/AuthService';
import { CeoPortrait } from './CeoPortrait';

interface CeoLoginViewProps {
  navigate: (route: string) => void;
}

export const CeoLoginView: React.FC<CeoLoginViewProps> = ({ navigate }) => {
  const hasCeoAccount = authService.hasAccountWithRole('CEO');
  const [mode, setMode] = useState<'signin' | 'register'>(() => (hasCeoAccount ? 'signin' : 'register'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = authService.calculateStrength(password);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide executive credentials.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = authService.loginAsCeo(email, password);
      setLoading(false);

      if (!res.success) {
        setError(res.error || 'Access Denied: Invalid CEO credentials. If you haven\'t created your executive account yet, click "Create CEO Account" below.');
        return;
      }

      setSuccess('Executive clearance verified. Launching CEO Cockpit...');
      setTimeout(() => {
        navigate('ceo');
      }, 500);
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required executive fields.');
      return;
    }

    if (password.length < 6) {
      setError('Executive password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = authService.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+973 3562 8353',
        country: 'Bahrain',
        passwordPlain: password,
        role: 'CEO',
        accountType: 'EXECUTIVE',
        companyName: 'Bab Al-Khaleej & Back for Brand LLC',
      });
      setLoading(false);

      if (!res.success) {
        setError(res.error || 'Failed to establish executive credentials.');
        return;
      }

      setSuccess('CEO Executive Account created successfully! Taking command...');
      setTimeout(() => {
        navigate('ceo');
      }, 600);
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#14141d] border border-[#e8c872]/40 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(232,200,114,0.15)] animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#e8c872] overflow-hidden shadow-[0_0_20px_rgba(232,200,114,0.3)]">
            <CeoPortrait size="md" rounded="full" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/30 px-3 py-1 rounded-full font-bold">
            RESTRICTED · CHIEF EXECUTIVE OFFICER
          </span>
          <h1 className="text-2xl font-serif font-bold text-white mt-3">
            {mode === 'signin' ? 'CEO Executive Entrance' : 'Establish CEO Account'}
          </h1>
          <p className="text-xs text-[#a8a7b3] mt-1">
            {mode === 'signin'
              ? 'Access to proprietary 25 AI Agents fleet, financials, and company governance.'
              : 'Register your executive profile and master clearance credentials.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-[#0a0a0f] p-1 border border-[#2a2a38] text-xs font-semibold mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
                : 'text-[#a8a7b3] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
                : 'text-[#a8a7b3] hover:text-white'
            }`}
          >
            Create CEO Account
          </button>
        </div>

        {error && (
          <div className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {!hasCeoAccount && mode === 'register' && (
          <div className="p-3.5 mb-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#e8c872] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#e8c872] font-semibold mb-0.5">First-Time Executive Setup:</strong>
              No fixed or default credentials exist. Please fill out the form below to create your master CEO executive account and set your own secure password.
            </div>
          </div>
        )}

        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">Executive Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter executive email address"
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#e8c872] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">Executive Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter executive password"
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#e8c872] rounded-xl px-4 py-2.5 pr-10 text-xs text-white outline-none"
                  required
                />
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
              disabled={loading}
              className="btn-gold w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform mt-2"
            >
              <Crown className="w-4 h-4" />
              <span>{loading ? 'Verifying Executive Clearance...' : 'Authenticate as CEO'}</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-xs text-[#e8c872] hover:underline cursor-pointer"
              >
                No executive account yet? Click here to create one →
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Executive Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Ghazi Wazir"
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#e8c872] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Executive Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., ghazi@backforbrand.com"
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#e8c872] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Direct Phone / WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+973 3562 8353"
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#e8c872] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Create Executive Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#e8c872] rounded-xl px-4 py-2.5 pr-10 text-xs text-white outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#a8a7b3] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                  <span className="text-[#a8a7b3]">Strength:</span>
                  <span className="font-bold text-[#e8c872]">{passwordStrength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#e8c872] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Executive Account...' : 'Establish CEO Account'}</span>
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-[#2a2a38] flex items-center justify-between text-[11px] text-[#888]">
          <button
            onClick={() => navigate('')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            ← Public Website
          </button>
          <button
            onClick={() => navigate('login')}
            className="hover:text-[#e8c872] transition-colors cursor-pointer"
          >
            Customer Portal →
          </button>
        </div>
      </div>
    </div>
  );
};
