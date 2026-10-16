import React from 'react';
import { ShieldAlert, ArrowLeft, Home, Lock, Key, Crown, Shield, Radio, UserPlus } from 'lucide-react';
import { AppRole } from '../types/auth';

interface AccessDeniedViewProps {
  path?: string;
  userRole?: AppRole;
  navigate: (route: string) => void;
  requiredRole?: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  path = '',
  userRole = 'PUBLIC',
  navigate,
  requiredRole,
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-[#14141d] border border-red-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-in fade-in zoom-in-95 duration-200">
        {/* Shield Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Lock className="w-3 h-3" />
          <span>HTTP 403 · Access Forbidden</span>
        </div>

        <h1 className="text-2xl font-serif font-bold text-white mb-2">
          Authentication & Credentials Required
        </h1>

        <p className="text-xs sm:text-sm text-[#a8a7b3] leading-relaxed mb-5">
          This resource is protected by sovereign RBAC security. Your current identity status (
          <span className="font-mono text-[#e8c872] font-semibold">{userRole}</span>
          ) does not have clearance to view this internal section without authenticating.
          {requiredRole && (
            <span className="block mt-1 text-[11px] text-cyan-300">
              Required Clearance: <strong>{requiredRole}</strong>
            </span>
          )}
        </p>

        {/* Security context notice */}
        <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3 text-[11px] text-[#888] mb-5 text-left font-mono">
          <div className="flex justify-between mb-1">
            <span>Requested Resource:</span>
            <span className="text-white truncate max-w-[180px]">/{path}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Active Session:</span>
            <span className={userRole === 'PUBLIC' ? 'text-amber-400' : 'text-emerald-400'}>
              {userRole === 'PUBLIC' ? 'Unauthenticated (No Clearance)' : userRole}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Security Policy:</span>
            <span className="text-cyan-400">Credentials Enforced · Direct Bypass Disabled</span>
          </div>
        </div>

        {/* Dedicated Sign-In & Registration Options */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => navigate('signup')}
            className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-[#e8c872] to-[#cba34e] text-[#0a0a0f] flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create / Register New Account</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('ceo/login')}
              className="py-2.5 px-3 text-xs font-semibold rounded-xl bg-[#1c1c28] hover:bg-[#252538] text-[#e8c872] border border-[#e8c872]/30 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>CEO Sign In</span>
            </button>

            <button
              onClick={() => navigate('admin/login')}
              className="py-2.5 px-3 text-xs font-semibold rounded-xl bg-[#1c1c28] hover:bg-[#252538] text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Sign In</span>
            </button>
          </div>

          <button
            onClick={() => navigate('login')}
            className="w-full py-2.5 text-xs text-[#a8a7b3] hover:text-white bg-[#0a0a0f] hover:bg-[#1a1a26] border border-[#2a2a38] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-[#e8c872]" />
            <span>Client & Partner Portal Sign In</span>
          </button>

          <button
            onClick={() => navigate('')}
            className="w-full py-2 text-xs text-[#777] hover:text-[#bbb] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
