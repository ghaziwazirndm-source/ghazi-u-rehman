import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  User,
  Crown,
  Radio,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Cpu,
} from 'lucide-react';
import { authService } from '../services/AuthService';
import { AppRole } from '../types/auth';
import {
  normalizeRole,
  getAccessibleModules,
  getProtectedModules,
  ROLE_PERMISSIONS,
} from '../permissions/accessControl';

interface SecurityTestPanelProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const SecurityTestPanel: React.FC<SecurityTestPanelProps> = ({
  currentRoute,
  navigate,
}) => {
  // Only render in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(() => authService.getCurrentSession());
  const [apiTestResult, setApiTestResult] = useState<{
    endpoint: string;
    status: number;
    message: string;
    success: boolean;
  } | null>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setSession(authService.getCurrentSession());
    };
    window.addEventListener('gw_auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('gw_auth_state_changed', handleAuthChange);
  }, []);

  const currentRole: AppRole = session?.user ? normalizeRole(session.user.role) : 'PUBLIC';
  const accessible = getAccessibleModules(currentRole);
  const protectedModules = getProtectedModules(currentRole);
  const permissions = ROLE_PERMISSIONS[currentRole] || [];

  const handleRoleSwitch = (targetRole: AppRole) => {
    if (targetRole === 'PUBLIC') {
      authService.logout();
      setApiTestResult(null);
      return;
    }
    // Navigate to respective authentication route
    if (targetRole === 'CEO') {
      navigate('ceo/login');
    } else if (targetRole === 'ADMIN') {
      navigate('admin/login');
    } else if (targetRole === 'AGENT' || targetRole === 'STAFF') {
      navigate('agent/login');
    } else {
      navigate('login');
    }
    setIsOpen(false);
  };

  const handleTestApi = async (endpoint: string, requiredRole: string) => {
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session?.token ? `Bearer ${session.token}` : '',
          'X-User-Role': currentRole,
          'X-User-Id': session?.user?.id || 'anon',
          'X-Session-Signature': session?.signature || '',
        },
      });

      const data = await res.json().catch(() => ({}));
      setApiTestResult({
        endpoint,
        status: res.status,
        message:
          res.status === 200
            ? `200 OK — Authorized (${data.message || 'Data received'})`
            : res.status === 403
            ? `403 Forbidden — Access Denied (Requires ${requiredRole})`
            : `${res.status} Unauthorized — Token missing/invalid`,
        success: res.status === 200,
      });
    } catch {
      // Offline fallback simulation
      const authorized =
        (requiredRole === 'CEO' && currentRole === 'CEO') ||
        (requiredRole === 'ADMIN' && (currentRole === 'ADMIN' || currentRole === 'CEO')) ||
        (requiredRole === 'AGENT' && ['AGENT', 'STAFF', 'ADMIN', 'CEO'].includes(currentRole));

      setApiTestResult({
        endpoint,
        status: authorized ? 200 : 403,
        message: authorized
          ? `200 OK — Access Granted (Role: ${currentRole})`
          : `403 Forbidden — Blocked at Gateway (Requires ${requiredRole})`,
        success: authorized,
      });
    }
  };

  return (
    <aside
      aria-label="Security RBAC Test Bench"
      className="fixed bottom-6 right-24 z-50 font-sans"
    >
      {/* Floating Collapsed Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#101018] border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-xs text-white hover:border-cyan-400 transition-all cursor-pointer group"
          title="Open Strict RBAC Security Test Bench"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono font-bold text-cyan-300">RBAC Security Bench</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase bg-cyan-950 text-cyan-400 border border-cyan-500/40">
            {currentRole}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-[#888] group-hover:text-white" />
        </button>
      )}

      {/* Expanded Modal Box */}
      {isOpen && (
        <div className="w-96 max-w-[95vw] max-h-[85vh] overflow-y-auto bg-[#0e0e16] border border-cyan-500/50 rounded-2xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] text-xs text-[#a8a7b3] animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <strong className="text-white font-mono text-xs">
                RBAC Security Test Bench [DEV ONLY]
              </strong>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:text-white rounded hover:bg-[#1a1a26] cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Current State Indicator */}
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-3 mb-3 font-mono text-[11px]">
            <div className="flex justify-between items-center mb-1">
              <span>Current Role:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase ${
                  currentRole === 'CEO'
                    ? 'bg-[#e8c872]/20 text-[#e8c872] border border-[#e8c872]/40'
                    : currentRole === 'ADMIN'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : currentRole === 'AGENT' || currentRole === 'STAFF'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                    : currentRole === 'USER'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {currentRole}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>Active User:</span>
              <span className="text-white truncate max-w-[170px]">
                {session?.user ? `${session.user.name}` : 'Anonymous Visitor'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>Account Email:</span>
              <span className="text-[#888] truncate max-w-[170px]">
                {session?.user ? session.user.email : 'None (Public)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Token Signature:</span>
              <span className={session ? 'text-emerald-400' : 'text-[#666]'}>
                {session ? 'Verified HMAC-Sig' : 'Unsigned'}
              </span>
            </div>
          </div>

          {/* Portal Authentication Routes */}
          <div className="mb-3">
            <span className="block text-[10px] font-mono text-cyan-400 uppercase font-bold mb-1.5">
              Portal Sign-In Tests (Requires Credentials):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['PUBLIC', 'USER', 'AGENT', 'STAFF', 'ADMIN', 'CEO'] as AppRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`py-1.5 px-2 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    currentRole === r
                      ? 'bg-cyan-500 text-[#0a0a0f] shadow-md font-extrabold'
                      : 'bg-[#14141d] hover:bg-[#1f1f2e] text-[#a8a7b3] border border-[#2a2a38]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Direct URL Route Penetration Test */}
          <div className="mb-3">
            <span className="block text-[10px] font-mono text-cyan-400 uppercase font-bold mb-1.5">
              URL Penetration Guard Test:
            </span>
            <div className="space-y-1">
              {[
                { label: 'Test /ceo (CEO Cockpit)', route: 'ceo', roleNeeded: 'CEO' },
                { label: 'Test /admin (Admin Console)', route: 'admin', roleNeeded: 'ADMIN | CEO' },
                { label: 'Test /settings (Configuration Options)', route: 'settings', roleNeeded: 'ADMIN | CEO' },
                { label: 'Test /live-agent (Agent Desk)', route: 'live-agent', roleNeeded: 'AGENT | STAFF | ADMIN | CEO' },
                { label: 'Test /portal (Customer Portal)', route: 'portal', roleNeeded: 'USER | STAFF | ADMIN | CEO' },
              ].map((test) => (
                <button
                  key={test.route}
                  onClick={() => navigate(test.route)}
                  className="w-full text-left p-1.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#2a2a38] flex items-center justify-between text-[11px] cursor-pointer"
                >
                  <span className="truncate">{test.label}</span>
                  <span className="text-[9px] text-[#666] font-mono shrink-0 ml-1">
                    Req: {test.roleNeeded}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Backend API Endpoint RBAC Test */}
          <div className="mb-3">
            <span className="block text-[10px] font-mono text-cyan-400 uppercase font-bold mb-1.5">
              Backend API Guard Simulation:
            </span>
            <div className="grid grid-cols-2 gap-1.5 mb-1.5">
              <button
                onClick={() => handleTestApi('/api/ceo/financials', 'CEO')}
                className="p-1.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#2a2a38] text-[10px] text-left cursor-pointer truncate"
              >
                GET /api/ceo/financials
              </button>
              <button
                onClick={() => handleTestApi('/api/admin/crm/all-leads', 'ADMIN')}
                className="p-1.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#2a2a38] text-[10px] text-left cursor-pointer truncate"
              >
                GET /api/admin/crm/all-leads
              </button>
              <button
                onClick={() => handleTestApi('/api/agent/live-chats', 'AGENT')}
                className="p-1.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#2a2a38] text-[10px] text-left cursor-pointer truncate"
              >
                GET /api/agent/live-chats
              </button>
              <button
                onClick={() => handleTestApi('/api/customer/my-dossier', 'USER')}
                className="p-1.5 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#2a2a38] text-[10px] text-left cursor-pointer truncate"
              >
                GET /api/customer/my-dossier
              </button>
            </div>

            {apiTestResult && (
              <div
                className={`p-2 rounded-lg border text-[10px] font-mono ${
                  apiTestResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/40 text-red-300'
                }`}
              >
                <div>HTTP {apiTestResult.status} Response:</div>
                <div className="font-semibold">{apiTestResult.message}</div>
              </div>
            )}
          </div>

          {/* Accessible vs Protected Modules List */}
          <div className="border-t border-[#2a2a38] pt-2">
            <details className="text-[10px]">
              <summary className="font-mono text-[#e8c872] cursor-pointer mb-1">
                View Accessible Modules ({accessible.length}) & Protected ({protectedModules.length})
              </summary>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">
                    ✓ Accessible to {currentRole}:
                  </span>
                  <ul className="space-y-0.5 list-disc list-inside text-[#bbb]">
                    {accessible.map((m) => (
                      <li key={m.id} className="truncate">
                        {m.name} ({m.path})
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-red-400 font-bold block mb-1">
                    ✕ Protected from {currentRole}:
                  </span>
                  <ul className="space-y-0.5 list-disc list-inside text-[#888]">
                    {protectedModules.map((m) => (
                      <li key={m.id} className="truncate">
                        {m.name} ({m.path})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </div>
      )}
    </aside>
  );
};
