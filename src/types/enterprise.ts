// Core Enterprise Data Models and RBAC Interfaces

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'SALES'
  | 'CONTENT'
  | 'SUPPORT'
  | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'manage_integrations';
  resource: 'leads' | 'bookings' | 'customers' | 'services' | 'content' | 'analytics' | 'settings' | 'audit_logs';
}

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'CONSULTATION'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export type LeadTemperature = 'HOT' | 'WARM' | 'COLD';

export type LeadSource =
  | 'website'
  | 'whatsapp'
  | 'vsl_funnel'
  | 'referral'
  | 'linkedin'
  | 'direct'
  | string;

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  service: string;
  package?: string;
  budget?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  temperature: LeadTemperature;
  notes?: string[];
  assignedTo?: string;
  createdDate: string;
  updatedDate: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  consultationType: 'virtual_meet' | 'in_person_manama' | 'executive_call' | 'whatsapp_direct';
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  message?: string;
  status: BookingStatus;
  meetingLink?: string;
  assignedAdvisor: string;
  createdDate: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  crNumber?: string;
  country: string;
  email: string;
  phone: string;
  activeServices: string[];
  totalValueBhd: number;
  status: 'active' | 'in_progress' | 'completed' | 'on_hold';
  onboardingDate: string;
}

export interface ServiceDefinition {
  id: string;
  title: string;
  category: 'bahrain' | 'tech' | 'enterprise';
  shortDesc: string;
  startingPriceBhd?: number;
  deliveryDays?: string;
  sla?: string;
  isActive: boolean;
}

export interface PackageDefinition {
  id: string;
  name: string;
  serviceId: string;
  priceBhd: number;
  priceUsd: number;
  features: string[];
  recommended?: boolean;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: 'communication' | 'social' | 'calendar' | 'payments' | 'ai' | 'analytics';
  description: string;
  status: 'NOT_CONNECTED' | 'CONNECTED' | 'CONFIGURATION_REQUIRED';
  provider: string;
  icon: string;
  authType: 'oauth2' | 'api_key' | 'webhook';
  configDocUrl?: string;
  lastSyncAt?: string;
  environmentRequired: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetResource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
  details: string;
}

export interface TenantBranding {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  jurisdiction: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  executiveName: string;
  executiveRole: string;
  contactEmail: string;
  contactPhone: string;
  supportedServices: string[];
}
