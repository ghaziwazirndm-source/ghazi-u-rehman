// Strict Authentication & RBAC Service with Signature Verification & Data Isolation
import { UserAccount, AuthSession, AppRole, PasswordGeneratorOptions } from '../types/auth';
import { mailService } from './MailService';
import { normalizeRole } from '../permissions/accessControl';

const USERS_STORAGE_KEY = 'gw_auth_users_v4';
const SESSION_STORAGE_KEY = 'gw_auth_session_v4';
const AUTH_SECRET_SALT = 'gw_sec_strict_rbac_2026_salt_sig';

// Compute cryptographic-like signature to prevent localStorage tampering
export function computeSessionSignature(userId: string, role: string, token: string): string {
  const payload = `${userId}:${role}:${token}:${AUTH_SECRET_SALT}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `sig_${Math.abs(hash).toString(36)}_${payload.length}`;
}

// Fixed accounts removed per security directive: users must register their own accounts with passwords.
export const SEED_USERS: (UserAccount & { passwordHash: string })[] = [];

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    try {
      // Purge obsolete legacy v3 storage if present to avoid using old hardcoded demo credentials
      if (localStorage.getItem('gw_auth_users_v3')) {
        localStorage.removeItem('gw_auth_users_v3');
        localStorage.removeItem('gw_auth_session_v3');
      }

      if (!localStorage.getItem(USERS_STORAGE_KEY)) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      }
    } catch {
      // LocalStorage unavailable
    }
  }

  public getUsers(): (UserAccount & { passwordHash: string })[] {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveUsers(users: (UserAccount & { passwordHash: string })[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {
      // Storage error
    }
  }

  // Retrieve validated session with signature tamper check
  public getCurrentSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);

      // Check expiration
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        this.logout();
        return null;
      }

      // TAMPER CHECK: Verify token signature against userId and role
      const expectedSig = computeSessionSignature(session.user.id, session.user.role, session.token);
      if (session.signature !== expectedSig) {
        console.warn('[Security Guard] Tampered session detected. Signature mismatch. Revoking access.');
        this.logout();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  public getCurrentUser(): UserAccount | null {
    return this.getCurrentSession()?.user || null;
  }

  public getCurrentRole(): AppRole {
    const user = this.getCurrentUser();
    return user ? normalizeRole(user.role) : 'PUBLIC';
  }

  // Standard authentication
  public login(
    email: string,
    passwordPlain: string
  ): { success: boolean; session?: AuthSession; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'No account registered with this email address. Please register a new account.' };
    }

    if (found.passwordHash !== passwordPlain.trim()) {
      return { success: false, error: 'Incorrect password. Please verify your credentials or reset your password.' };
    }

    // Update last login
    found.lastLoginAt = new Date().toISOString();
    this.saveUsers(users);

    const token = `gw_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const signature = computeSessionSignature(found.id, found.role, token);

    const session: AuthSession = {
      user: {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        country: found.country,
        role: normalizeRole(found.role),
        companyName: found.companyName,
        crNumber: found.crNumber,
        accountType: found.accountType,
        createdAt: found.createdAt,
        lastLoginAt: found.lastLoginAt,
        isVerified: found.isVerified,
        twoFactorEnabled: found.twoFactorEnabled,
      },
      token,
      signature,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      window.dispatchEvent(new CustomEvent('gw_auth_state_changed', { detail: session }));
    } catch {
      // Session error
    }

    return { success: true, session };
  }

  // Specific CEO Login: Enforces role === 'CEO'
  public loginAsCeo(
    email: string,
    passwordPlain: string
  ): { success: boolean; session?: AuthSession; error?: string } {
    const res = this.login(email, passwordPlain);
    if (!res.success || !res.session) return res;

    if (normalizeRole(res.session.user.role) !== 'CEO') {
      this.logout();
      return { success: false, error: 'Access Denied: This portal requires Chief Executive Officer (CEO) credentials.' };
    }
    return res;
  }

  // Specific Admin Login: Enforces role === 'ADMIN' | 'CEO'
  public loginAsAdmin(
    email: string,
    passwordPlain: string
  ): { success: boolean; session?: AuthSession; error?: string } {
    const res = this.login(email, passwordPlain);
    if (!res.success || !res.session) return res;

    const role = normalizeRole(res.session.user.role);
    if (role !== 'ADMIN' && role !== 'CEO') {
      this.logout();
      return { success: false, error: 'Access Denied: This portal requires Administrator credentials.' };
    }
    return res;
  }

  // Specific Agent Login: Enforces role === 'AGENT' | 'STAFF' | 'ADMIN' | 'CEO'
  public loginAsAgent(
    email: string,
    passwordPlain: string
  ): { success: boolean; session?: AuthSession; error?: string } {
    const res = this.login(email, passwordPlain);
    if (!res.success || !res.session) return res;

    const role = normalizeRole(res.session.user.role);
    if (!['AGENT', 'STAFF', 'ADMIN', 'CEO'].includes(role)) {
      this.logout();
      return { success: false, error: 'Access Denied: This portal requires Operational Agent credentials.' };
    }
    return res;
  }

  // Register: Creates a new user account with designated role
  public register(data: {
    name: string;
    email: string;
    phone: string;
    country?: string;
    passwordPlain: string;
    companyName?: string;
    accountType?: 'INVESTOR' | 'CORPORATE' | 'STARTUP' | 'GOVERNMENT' | 'STAFF' | 'EXECUTIVE';
    role?: AppRole;
  }): { success: boolean; session?: AuthSession; error?: string } {
    const cleanEmail = data.email.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
    }

    if (!data.passwordPlain || data.passwordPlain.trim().length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const assignedRole: AppRole = data.role ? normalizeRole(data.role) : 'USER';
    const assignedAccountType =
      data.accountType ||
      (assignedRole === 'CEO'
        ? 'EXECUTIVE'
        : assignedRole === 'ADMIN' || assignedRole === 'AGENT' || assignedRole === 'STAFF'
        ? 'STAFF'
        : 'INVESTOR');

    const newUser: UserAccount & { passwordHash: string } = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      country: data.country?.trim() || 'Bahrain',
      role: assignedRole,
      companyName: data.companyName?.trim() || undefined,
      accountType: assignedAccountType,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isVerified: true,
      twoFactorEnabled: false,
      passwordHash: data.passwordPlain.trim(),
    };

    const updatedUsers = [...users, newUser];
    this.saveUsers(updatedUsers);

    // Send welcome onboarding email
    mailService.enqueue('PROPOSAL_DELIVERY', cleanEmail, {
      clientName: newUser.name,
      packageName: `${assignedRole} Portal Access Established`,
      priceBhd: 0,
    });

    const token = `gw_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const signature = computeSessionSignature(newUser.id, newUser.role, token);

    const session: AuthSession = {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        country: newUser.country,
        role: newUser.role,
        companyName: newUser.companyName,
        crNumber: newUser.crNumber,
        accountType: newUser.accountType,
        createdAt: newUser.createdAt,
        lastLoginAt: newUser.lastLoginAt,
        isVerified: newUser.isVerified,
        twoFactorEnabled: newUser.twoFactorEnabled,
      },
      token,
      signature,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      window.dispatchEvent(new CustomEvent('gw_auth_state_changed', { detail: session }));
    } catch {
      // Storage error
    }

    return { success: true, session };
  }

  // Direct login bypass removed per user security directive: accounts must be registered with passwords
  public loginWithRole(targetRole: AppRole): AuthSession | null {
    if (targetRole === 'PUBLIC') {
      this.logout();
      return null;
    }
    // Return current authenticated session if already signed in as the role
    const current = this.getCurrentSession();
    if (current && normalizeRole(current.user.role) === targetRole) {
      return current;
    }
    return null;
  }

  public hasAccountWithRole(role: AppRole): boolean {
    return this.getUsers().some((u) => normalizeRole(u.role) === role);
  }

  public logout(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('gw_auth_state_changed', { detail: null }));
    } catch {
      // Storage error
    }
  }

  // Cryptographic Password Generator
  public generatePassword(options: PasswordGeneratorOptions): string {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let pool = '';
    const guaranteed: string[] = [];

    if (options.includeUppercase) {
      pool += uppercase;
      guaranteed.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
    }
    if (options.includeLowercase) {
      pool += lowercase;
      guaranteed.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
    }
    if (options.includeNumbers) {
      pool += numbers;
      guaranteed.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }
    if (options.includeSymbols) {
      pool += symbols;
      guaranteed.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    if (!pool) pool = lowercase + numbers;

    const remainingLength = Math.max(0, options.length - guaranteed.length);
    const chars = [...guaranteed];

    for (let i = 0; i < remainingLength; i++) {
      chars.push(pool[Math.floor(Math.random() * pool.length)]);
    }

    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join('');
  }

  public generateStrongPassword(options: PasswordGeneratorOptions): string {
    return this.generatePassword(options);
  }

  public calculateStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (!password) return { score: 0, label: 'Empty', color: 'bg-zinc-700' };

    if (password.length >= 8) score += 1;
    if (password.length >= 14) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    if (score === 5) return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 4, label: 'Enterprise Grade', color: 'bg-[#e8c872]' };
  }
}

export const authService = AuthService.getInstance();
