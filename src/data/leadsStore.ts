// Client-Side CRM & Bookings Store (Frontend Demonstration Layer)
// Prepares clean API contract for real PostgreSQL / Firebase / Cloud SQL backend integration.

import { Lead, Booking, AuditLogEntry } from '../types/enterprise';
import { db, OperationType, handleFirestoreError } from '../services/firebase';
import { doc, setDoc, collection, onSnapshot, getDocs } from 'firebase/firestore';

const LEADS_STORAGE_KEY = 'gw_crm_leads_v1';
const BOOKINGS_STORAGE_KEY = 'gw_crm_bookings_v1';
const AUDIT_STORAGE_KEY = 'gw_audit_logs_v1';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@gulflogistics.bh',
    phone: '+973 3944 1122',
    whatsapp: '+973 3944 1122',
    country: 'Bahrain',
    service: 'New Company Registration (CR)',
    package: 'Full Turnkey Formation',
    budget: '1,500 BHD',
    source: 'vsl_funnel',
    status: 'QUALIFIED',
    priority: 'high',
    temperature: 'HOT',
    notes: ['Interested in With-Limited-Liability (W.L.L.) setup in Seef.', 'Needs 3 foreign partner investor visas.'],
    createdDate: '2026-10-02T09:15:00Z',
    updatedDate: '2026-10-03T14:20:00Z',
  },
  {
    id: 'lead-102',
    name: 'Marcus Vance',
    email: 'm.vance@solardrive.tech',
    phone: '+1 415 890 3211',
    whatsapp: '+1 415 890 3211',
    country: 'United States',
    service: 'Enterprise SEO & Generative Engine Optimization (GEO/AEO)',
    package: 'Enterprise AI Search Engine Optimization',
    budget: '$4,500 / month',
    source: 'website',
    status: 'CONSULTATION',
    priority: 'urgent',
    temperature: 'HOT',
    notes: ['SaaS founder seeking citations in ChatGPT and Perplexity.', 'Requested audit of 24 product pages.'],
    createdDate: '2026-10-03T11:00:00Z',
    updatedDate: '2026-10-03T16:45:00Z',
  },
  {
    id: 'lead-103',
    name: 'Fatima Al-Ghatam',
    email: 'fatima@alghatam.com',
    phone: '+973 3611 7890',
    whatsapp: '+973 3611 7890',
    country: 'Bahrain',
    service: 'Ministry Document Clearance',
    package: 'Commercial Activity Expansion',
    budget: '850 BHD',
    source: 'whatsapp',
    status: 'PROPOSAL',
    priority: 'medium',
    temperature: 'WARM',
    notes: ['Adding specialized medical trading activity to existing CR.', 'Awaiting NHRA inspection scheduling.'],
    createdDate: '2026-10-01T15:30:00Z',
    updatedDate: '2026-10-02T10:10:00Z',
  },
  {
    id: 'lead-104',
    name: 'Kenji Takahashi',
    email: 'takahashi@tokyofin.jp',
    phone: '+81 3 5555 0192',
    whatsapp: '+81 90 1234 5678',
    country: 'Japan',
    service: 'Bahrain Investor Golden Visa',
    package: '10-Year Golden Residency Advisory',
    budget: '2,200 BHD',
    source: 'linkedin',
    status: 'NEW',
    priority: 'high',
    temperature: 'WARM',
    notes: ['High-net-worth real estate investor.', 'Submitting Bahrain Bay property ownership proof.'],
    createdDate: '2026-10-04T06:10:00Z',
    updatedDate: '2026-10-04T06:10:00Z',
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-201',
    serviceId: 'business-registration',
    serviceName: 'New Company Registration (CR)',
    consultationType: 'virtual_meet',
    date: '2026-10-07',
    timeSlot: '11:00 AM',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@gulflogistics.bh',
    whatsapp: '+973 3944 1122',
    country: 'Bahrain',
    message: 'Review W.L.L. commercial activities and shareholding structure.',
    status: 'CONFIRMED',
    meetingLink: 'https://meet.google.com/xyz-ghazi-demo',
    assignedAdvisor: 'Ghazi Wazir',
    createdDate: '2026-10-02T09:20:00Z',
  },
  {
    id: 'bk-202',
    serviceId: 'seo',
    serviceName: 'Enterprise SEO & GEO/AEO',
    consultationType: 'executive_call',
    date: '2026-10-08',
    timeSlot: '3:30 PM',
    name: 'Marcus Vance',
    email: 'm.vance@solardrive.tech',
    whatsapp: '+1 415 890 3211',
    country: 'United States',
    message: 'Explore AI search optimization and Google grounding setup.',
    status: 'CONFIRMED',
    assignedAdvisor: 'Ghazi Wazir',
    createdDate: '2026-10-03T11:15:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-01',
    timestamp: '2026-10-04T07:20:00Z',
    actorEmail: 'ghaziwazirndm@gmail.com',
    actorRole: 'SUPER_ADMIN',
    action: 'LEAD_STATUS_UPDATE',
    targetResource: 'leads/lead-101',
    ipAddress: '82.194.24.12 (Bahrain)',
    status: 'SUCCESS',
    details: 'Changed status from CONTACTED to QUALIFIED',
  },
  {
    id: 'aud-02',
    timestamp: '2026-10-04T06:12:00Z',
    actorEmail: 'system_webhook@gateway.local',
    actorRole: 'VIEWER',
    action: 'NEW_BOOKING_CAPTURED',
    targetResource: 'bookings/bk-202',
    ipAddress: '10.0.4.18 (Vite Internal)',
    status: 'SUCCESS',
    details: 'Captured consultation request from Marcus Vance',
  },
  {
    id: 'aud-03',
    timestamp: '2026-10-04T05:00:00Z',
    actorEmail: 'security_auditor@backforbrand.com',
    actorRole: 'ADMIN',
    action: 'INTEGRATION_HEALTH_CHECK',
    targetResource: 'integrations/whatsapp_cloud',
    ipAddress: '198.51.100.42 (US)',
    status: 'WARNING',
    details: 'WhatsApp Cloud API webhook endpoint requires production token validation',
  },
];

// Helper functions for state management
export const getStoredLeads = (): Lead[] => {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEADS;
  }
};

export const saveLead = (lead: Lead): void => {
  try {
    const existing = getStoredLeads();
    const updated = [lead, ...existing.filter((l) => l.id !== lead.id)];
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }

  // Persist to Cloud Firestore
  const pathForWrite = `leads/${lead.id}`;
  setDoc(doc(db, 'leads', lead.id), {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone || '',
    whatsapp: lead.whatsapp || '',
    country: lead.country || 'Bahrain',
    service: lead.service,
    package: lead.package || '',
    budget: lead.budget || '',
    source: lead.source || 'website',
    status: lead.status,
    temperature: lead.temperature || 'WARM',
    notes: (lead.notes || []).join('\n'),
    createdDate: lead.createdDate,
    updatedDate: lead.updatedDate,
  }).catch((err) => {
    try {
      handleFirestoreError(err, OperationType.WRITE, pathForWrite);
    } catch (e) {
      console.warn('[Firestore] Lead write handled:', e);
    }
  });
};

export const getStoredBookings = (): Booking[] => {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
};

export const saveBooking = (booking: Booking): void => {
  try {
    const existing = getStoredBookings();
    const updated = [booking, ...existing.filter((b) => b.id !== booking.id)];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }

  // Persist to Cloud Firestore
  const pathForWrite = `bookings/${booking.id}`;
  setDoc(doc(db, 'bookings', booking.id), {
    id: booking.id,
    serviceId: booking.serviceId || '',
    serviceName: booking.serviceName,
    consultationType: booking.consultationType || 'virtual_meet',
    date: booking.date,
    timeSlot: booking.timeSlot,
    name: booking.name,
    email: booking.email,
    whatsapp: booking.whatsapp || '',
    country: booking.country || 'Bahrain',
    message: booking.message || '',
    status: booking.status,
    meetingLink: booking.meetingLink || '',
    assignedAdvisor: booking.assignedAdvisor || 'Ghazi Wazir',
    createdDate: booking.createdDate,
  }).catch((err) => {
    try {
      handleFirestoreError(err, OperationType.WRITE, pathForWrite);
    } catch (e) {
      console.warn('[Firestore] Booking write handled:', e);
    }
  });
};

export const getStoredAuditLogs = (): AuditLogEntry[] => {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
};

/**
 * Real-time Cloud Firestore synchronization for Leads
 */
export const subscribeToLeads = (callback: (leads: Lead[]) => void): (() => void) => {
  const pathForOnSnapshot = 'leads';
  try {
    return onSnapshot(
      collection(db, pathForOnSnapshot),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudLeads: Lead[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as any;
            cloudLeads.push({
              id: d.id,
              name: data.name || 'Client',
              email: data.email || '',
              phone: data.phone || '',
              whatsapp: data.whatsapp || '',
              country: data.country || 'Bahrain',
              service: data.service || 'Advisory',
              package: data.package || '',
              budget: data.budget || '',
              source: data.source || 'website',
              status: data.status || 'NEW',
              priority: data.priority || 'medium',
              temperature: data.temperature || 'WARM',
              notes: typeof data.notes === 'string' ? data.notes.split('\n') : (data.notes || []),
              createdDate: data.createdDate || new Date().toISOString(),
              updatedDate: data.updatedDate || new Date().toISOString(),
            });
          });
          if (cloudLeads.length > 0) {
            localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(cloudLeads));
            callback(cloudLeads);
          }
        }
      },
      (error) => {
        console.warn('[Firestore] Real-time leads sync fallback to local cache:', error.message);
      }
    );
  } catch {
    return () => {};
  }
};

/**
 * Real-time Cloud Firestore synchronization for Bookings
 */
export const subscribeToBookings = (callback: (bookings: Booking[]) => void): (() => void) => {
  const pathForOnSnapshot = 'bookings';
  try {
    return onSnapshot(
      collection(db, pathForOnSnapshot),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudBookings: Booking[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as any;
            cloudBookings.push({
              id: d.id,
              serviceId: data.serviceId || '',
              serviceName: data.serviceName || 'Consultation',
              consultationType: data.consultationType || 'virtual_meet',
              date: data.date || '',
              timeSlot: data.timeSlot || '10:00 AM',
              name: data.name || '',
              email: data.email || '',
              whatsapp: data.whatsapp || '',
              country: data.country || 'Bahrain',
              message: data.message || '',
              status: data.status || 'CONFIRMED',
              meetingLink: data.meetingLink || '',
              assignedAdvisor: data.assignedAdvisor || 'Ghazi Wazir',
              createdDate: data.createdDate || new Date().toISOString(),
            });
          });
          if (cloudBookings.length > 0) {
            localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(cloudBookings));
            callback(cloudBookings);
          }
        }
      },
      (error) => {
        console.warn('[Firestore] Real-time bookings sync fallback to local cache:', error.message);
      }
    );
  } catch {
    return () => {};
  }
};

/**
 * Seed initial records into Cloud Firestore
 */
export const seedCloudDatabase = async (): Promise<{ success: boolean; count: number }> => {
  let seeded = 0;
  try {
    for (const lead of INITIAL_LEADS) {
      await setDoc(doc(db, 'leads', lead.id), {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        whatsapp: lead.whatsapp || '',
        country: lead.country || 'Bahrain',
        service: lead.service,
        package: lead.package || '',
        budget: lead.budget || '',
        source: lead.source || 'website',
        status: lead.status,
        temperature: lead.temperature || 'WARM',
        notes: (lead.notes || []).join('\n'),
        createdDate: lead.createdDate,
        updatedDate: lead.updatedDate,
      });
      seeded++;
    }

    for (const bk of INITIAL_BOOKINGS) {
      await setDoc(doc(db, 'bookings', bk.id), {
        id: bk.id,
        serviceId: bk.serviceId || '',
        serviceName: bk.serviceName,
        consultationType: bk.consultationType || 'virtual_meet',
        date: bk.date,
        timeSlot: bk.timeSlot,
        name: bk.name,
        email: bk.email,
        whatsapp: bk.whatsapp || '',
        country: bk.country || 'Bahrain',
        message: bk.message || '',
        status: bk.status,
        meetingLink: bk.meetingLink || '',
        assignedAdvisor: bk.assignedAdvisor || 'Ghazi Wazir',
        createdDate: bk.createdDate,
      });
      seeded++;
    }

    return { success: true, count: seeded };
  } catch (err) {
    console.warn('[Firestore] Seeding encountered error:', err);
    return { success: false, count: seeded };
  }
};
