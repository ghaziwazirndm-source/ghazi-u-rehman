// Centralized Strict Role-Based Access Control (RBAC) & Permission Engine
import { AppRole, AppPermission, UserRole } from '../types/auth';

// Standardize any role to strict AppRole
export function normalizeRole(role?: UserRole | string | null): AppRole {
  if (!role) return 'PUBLIC';
  const r = role.toUpperCase();
  if (r === 'CEO' || r === 'SUPER_ADMIN') return 'CEO';
  if (r === 'ADMIN') return 'ADMIN';
  if (r === 'STAFF') return 'STAFF';
  if (r === 'AGENT') return 'AGENT';
  if (r === 'USER' || r === 'CLIENT' || r === 'INVESTOR') return 'USER';
  return 'PUBLIC';
}

// Role-to-Permissions Mapping
export const ROLE_PERMISSIONS: Record<AppRole, AppPermission[]> = {
  PUBLIC: [
    'view_public_site',
  ],
  USER: [
    'view_public_site',
    'view_customer_dashboard',
  ],
  AGENT: [
    'view_public_site',
    'view_customer_dashboard',
    'view_live_agents',
    'manage_leads',
  ],
  STAFF: [
    'view_public_site',
    'view_customer_dashboard',
    'view_live_agents',
    'manage_leads',
    'manage_customers',
  ],
  ADMIN: [
    'view_public_site',
    'view_customer_dashboard',
    'view_live_agents',
    'manage_leads',
    'manage_customers',
    'manage_campaigns',
    'manage_ads',
    'manage_automation',
    'manage_system',
    'view_security',
    'manage_settings',
    // Note: ADMIN explicitly DOES NOT have 'view_ceo_dashboard', 'manage_ai_agents', 'view_financials', 'manage_team'
  ],
  CEO: [
    'view_public_site',
    'view_customer_dashboard',
    'view_live_agents',
    'manage_leads',
    'manage_customers',
    'manage_campaigns',
    'manage_ads',
    'manage_ai_agents',
    'manage_automation',
    'view_financials',
    'manage_team',
    'manage_system',
    'view_security',
    'manage_settings',
    'view_ceo_dashboard',
  ],
};

// Check if a role possesses a specific permission
export function hasPermission(role: AppRole | UserRole | undefined | null, permission: AppPermission): boolean {
  const norm = normalizeRole(role);
  const permissions = ROLE_PERMISSIONS[norm] || [];
  return permissions.includes(permission);
}

// Role Authorization Check
export function isRoleAuthorized(userRole: AppRole | UserRole | undefined | null, allowedRoles: AppRole[]): boolean {
  const norm = normalizeRole(userRole);
  return allowedRoles.includes(norm);
}

// System Module Definition
export interface SystemModule {
  id: string;
  name: string;
  path: string;
  requiredPermission: AppPermission;
  category: 'public' | 'customer' | 'operations' | 'management' | 'executive';
  description: string;
}

export const ALL_SYSTEM_MODULES: SystemModule[] = [
  // Public
  {
    id: 'public_site',
    name: 'Public Website & Services',
    path: '/',
    requiredPermission: 'view_public_site',
    category: 'public',
    description: 'Public marketing, services, packages, guides and booking.',
  },
  // Customer
  {
    id: 'customer_dashboard',
    name: 'Customer Dashboard & Dossier',
    path: '/portal',
    requiredPermission: 'view_customer_dashboard',
    category: 'customer',
    description: 'Personal filings, documents, appointments, retainers and customer assistant.',
  },
  // Agent & Operations
  {
    id: 'live_agent',
    name: 'Live Agent Desk & Queue',
    path: '/live-agent',
    requiredPermission: 'view_live_agents',
    category: 'operations',
    description: 'Live chat queues, customer support, WhatsApp inquiries, canned responses.',
  },
  {
    id: 'lead_management',
    name: 'CRM & Lead Management',
    path: '/admin?tab=crm',
    requiredPermission: 'manage_leads',
    category: 'operations',
    description: 'Enterprise leads, intake verification, lead scoring and assignment.',
  },
  {
    id: 'customer_management',
    name: 'Client Accounts & Dossier Operations',
    path: '/admin?tab=customers',
    requiredPermission: 'manage_customers',
    category: 'operations',
    description: 'Sijilat commercial registrations, LMRA visa files, investor dossiers.',
  },
  // Admin Management
  {
    id: 'admin_console',
    name: 'Admin Console & Operations',
    path: '/admin',
    requiredPermission: 'manage_system',
    category: 'management',
    description: 'Operational administration, integrations, mail queue, multi-tenant configs.',
  },
  {
    id: 'campaigns_ads',
    name: 'Marketing & Ad Campaigns',
    path: '/admin?tab=campaigns',
    requiredPermission: 'manage_ads',
    category: 'management',
    description: 'Meta Ads, Google Ads, TikTok funnels, audience targeting.',
  },
  {
    id: 'automation_builder',
    name: 'Workflow Automation Engine',
    path: '/admin?tab=automation',
    requiredPermission: 'manage_automation',
    category: 'management',
    description: 'Webhooks, Zapier/Make links, WhatsApp auto-responders.',
  },
  {
    id: 'security_settings',
    name: 'Security & Access Settings',
    path: '/admin?tab=security',
    requiredPermission: 'view_security',
    category: 'management',
    description: '2FA enforcement, audit logs, session timeouts, password policy.',
  },
  // CEO Executive
  {
    id: 'ceo_portal',
    name: 'CEO Executive Portal',
    path: '/ceo',
    requiredPermission: 'view_ceo_dashboard',
    category: 'executive',
    description: 'Comprehensive executive cockpit, P&L, Bahrain-Florida strategic overview.',
  },
  {
    id: 'ai_agents_army',
    name: '25 Autonomous AI Agents Army',
    path: '/ceo?tab=agents',
    requiredPermission: 'manage_ai_agents',
    category: 'executive',
    description: 'Fleet control: 25 AI agents across SEO, GMB, viral scripts, payments, filings.',
  },
  {
    id: 'company_financials',
    name: 'Executive Financials & Revenue Ledger',
    path: '/ceo?tab=revenue',
    requiredPermission: 'view_financials',
    category: 'executive',
    description: 'Company-wide retainers, cash flow, profit margins, Bahrain-Florida balance sheet.',
  },
  {
    id: 'team_governance',
    name: 'Team & Executive Governance',
    path: '/ceo?tab=team',
    requiredPermission: 'manage_team',
    category: 'executive',
    description: 'Staff directory, role assignments, salary retainers, organizational chart.',
  },
];

// Return accessible modules for a given role
export function getAccessibleModules(role: AppRole | UserRole | undefined | null): SystemModule[] {
  const norm = normalizeRole(role);
  return ALL_SYSTEM_MODULES.filter((m) => hasPermission(norm, m.requiredPermission));
}

// Return protected/restricted modules for a given role
export function getProtectedModules(role: AppRole | UserRole | undefined | null): SystemModule[] {
  const norm = normalizeRole(role);
  return ALL_SYSTEM_MODULES.filter((m) => !hasPermission(norm, m.requiredPermission));
}
