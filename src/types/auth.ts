// Authentication, Identity & Strict Role-Based Access Control (RBAC) Types

export type AppRole = 'PUBLIC' | 'USER' | 'STAFF' | 'AGENT' | 'ADMIN' | 'CEO';

// Backwards-compatible alias for existing components
export type UserRole = AppRole | 'SUPER_ADMIN' | 'CLIENT' | 'INVESTOR' | 'MANAGER' | 'SALES' | 'VIEWER';

export type AppPermission =
  | 'view_public_site'
  | 'view_customer_dashboard'
  | 'view_live_agents'
  | 'manage_leads'
  | 'manage_customers'
  | 'manage_campaigns'
  | 'manage_ads'
  | 'manage_ai_agents'
  | 'manage_automation'
  | 'view_financials'
  | 'manage_team'
  | 'manage_system'
  | 'view_security'
  | 'manage_settings'
  | 'view_ceo_dashboard';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  role: AppRole;
  companyName?: string;
  crNumber?: string;
  avatarUrl?: string;
  accountType: 'INVESTOR' | 'CORPORATE' | 'STARTUP' | 'GOVERNMENT' | 'STAFF' | 'EXECUTIVE';
  createdAt: string;
  lastLoginAt: string;
  isVerified: boolean;
  twoFactorEnabled?: boolean;
}

export interface AuthSession {
  user: UserAccount;
  token: string;
  signature: string;
  expiresAt: string;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}
