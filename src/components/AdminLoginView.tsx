import React, { useState } from 'react';
import { Shield, Lock, AlertCircle, Key, User, Phone, CheckCircle2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/AuthService';

interface AdminLoginViewProps {
  navigate: (route: string) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ navigate }) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
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
      setError('Please provide your administrator email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = authService.loginAsAdmin(email, password);
      setLoading(false);

      if (!res.success) {
        setError(res.error || 'Access Denied: Invalid administrator credentials. If you haven\'t created an admin account yet, click "Create Admin Account" below.');
        return;
      }

      setSuccess('Administrator clearance granted. Loading console...');
      setTimeout(() => {
        navigate('admin');
      }, 500);
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Admin password must be at least 6 characters.');
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
        phone: phone.trim() || '+973 3988 5544',
        country: 'Bahrain',
        passwordPlain: password,
        role: 'ADMIN',
        accountType: 'STAFF',
        companyName: 'Bab Al-Khaleej & Back for Brand Operational Admin',
      });
      setLoading(false);

      if (!res.success) {
        setError(res.error || 'Failed to establish admin credentials.');
        return;
      }

      setSuccess('Administrator account created successfully! Redirecting to Admin Dashboard...');
      setTimeout(() => {
        navigate('admin');
      }, 600);
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#14141d] border border-cyan-500/40 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full font-bold border border-cyan-500/30">
            INTERNAL · SYSTEM ADMINISTRATOR
          </span>
          <h1 className="text-2xl font-serif font-bold text-white mt-3">
            {mode === 'signin' ? 'Admin Console Sign In' : 'Create Admin Account'}
          </h1>
          <p className="text-xs text-[#a8a7b3] mt-1">
            {mode === 'signin'
              ? 'Operational CRM, client records, and service configuration.'
              : 'Register your master administrative credentials with custom password.'}
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
                ? 'bg-cyan-600 text-white font-bold shadow'
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
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-[#a8a7b3] hover:text-white'
            }`}
          >
            Create Admin
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

        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email address"
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-cyan-400 rounded-xl px-4 py-2.5 pr-10 text-xs text-white outline-none"
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
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform mt-2"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                No admin account yet? Click here to create a new one →
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Kareem Al-Sayed"
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Admin Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., admin@company.com"
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+973 3988 5544"
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Create Admin Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-cyan-400 rounded-xl px-4 py-2.5 pr-10 text-xs text-white outline-none"
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
                  <span className="font-bold text-cyan-300">{passwordStrength.label}</span>
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
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Admin Account...' : 'Create Admin Account'}</span>
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
