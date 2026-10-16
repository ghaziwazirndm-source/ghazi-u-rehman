// Payments Store & Multi-Gateway Transaction Repository
import { PaymentTransaction, PaymentGatewayType } from '../types/payments';
import { GHAZI_INFO } from './content';
import { db, OperationType, handleFirestoreError } from '../services/firebase';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';

const TRANSACTIONS_KEY = 'gw_crm_transactions_v1';

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'TX-BHD-901',
    clientName: 'Tariq Al-Mansoor',
    clientEmail: 'tariq.mansoor@gulflogistics.bh',
    clientPhone: '+973 3944 1122',
    clientCountry: 'Bahrain',
    serviceId: 'business-registration',
    serviceTitle: 'New Company Registration (CR)',
    packageTier: 'Complete Turnkey',
    amountBhd: 550,
    amountUsd: 1460,
    gateway: 'benefit_pay',
    gatewayName: 'BenefitPay (Bahrain)',
    status: 'SETTLED',
    referenceNumber: 'BP-8812904',
    fawriReference: 'FW-9921',
    notes: '50% initial retainer for W.L.L. commercial registration & 3 partner visas.',
    timestamp: '2026-10-02T10:15:00Z',
  },
  {
    id: 'TX-USD-902',
    clientName: 'Marcus Vance',
    clientEmail: 'm.vance@solardrive.tech',
    clientPhone: '+1 415 890 3211',
    clientCountry: 'United States',
    serviceId: 'seo',
    serviceTitle: 'Enterprise SEO & Generative AI Search (GEO/AEO)',
    packageTier: 'Scale Tech Retainer',
    amountBhd: 950,
    amountUsd: 2500,
    gateway: 'stripe_card',
    gatewayName: 'Stripe International',
    status: 'SETTLED',
    referenceNumber: 'pi_3P92kL2eZvKYlo2C',
    notes: 'Monthly enterprise AI search optimization & LLM citation indexing.',
    timestamp: '2026-10-03T14:40:00Z',
  },
  {
    id: 'TX-BHD-903',
    clientName: 'Fatima Al-Ghatam',
    clientEmail: 'fatima@alghatam.com',
    clientPhone: '+973 3611 7890',
    clientCountry: 'Bahrain',
    serviceId: 'document-consultancy',
    serviceTitle: 'Ministry Document Clearance',
    packageTier: 'Standard Activity Clearance',
    amountBhd: 280,
    amountUsd: 745,
    gateway: 'fawri_plus',
    gatewayName: 'Fawri / Fawri+ (Bahrain)',
    status: 'SETTLED',
    referenceNumber: 'FWP-440192',
    fawriReference: 'REF-NHRA-88',
    notes: 'NHRA medical activity clearance documentation fees.',
    timestamp: '2026-10-04T08:30:00Z',
  },
  {
    id: 'TX-USD-904',
    clientName: 'Kenji Takahashi',
    clientEmail: 'takahashi@tokyofin.jp',
    clientPhone: '+81 90 1234 5678',
    clientCountry: 'Japan',
    serviceId: 'investor-visa',
    serviceTitle: 'Bahrain Investor Golden Visa Advisory',
    packageTier: '10-Year Golden Residency',
    amountBhd: 850,
    amountUsd: 2250,
    gateway: 'bank_wire',
    gatewayName: 'Corporate Bank Wire (USD)',
    status: 'PENDING_VERIFICATION',
    referenceNumber: 'SWIFT-TYO-9912',
    notes: 'Property investment Golden Visa advisory retainer. Awaiting bank clearance.',
    timestamp: '2026-10-04T22:10:00Z',
  },
];

export const getStoredTransactions = (): PaymentTransaction[] => {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
};

export const saveTransaction = (tx: PaymentTransaction): void => {
  try {
    const existing = getStoredTransactions();
    const updated = [tx, ...existing.filter((t) => t.id !== tx.id)];
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }

  // Persist to Cloud Firestore
  const pathForWrite = `transactions/${tx.id}`;
  setDoc(doc(db, 'transactions', tx.id), {
    id: tx.id,
    clientName: tx.clientName,
    clientEmail: tx.clientEmail,
    clientPhone: tx.clientPhone || '',
    clientCountry: tx.clientCountry || 'Bahrain',
    serviceId: tx.serviceId,
    serviceTitle: tx.serviceTitle,
    packageTier: tx.packageTier || '',
    amountBhd: tx.amountBhd,
    amountUsd: tx.amountUsd,
    gateway: tx.gateway,
    gatewayName: tx.gatewayName,
    status: tx.status,
    referenceNumber: tx.referenceNumber || tx.id,
    fawriReference: tx.fawriReference || '',
    notes: tx.notes || '',
    timestamp: tx.timestamp,
  }).catch((err) => {
    try {
      handleFirestoreError(err, OperationType.WRITE, pathForWrite);
    } catch (e) {
      console.warn('[Firestore] Transaction write handled:', e);
    }
  });
};

export const generateWhatsAppPaymentDispatch = (tx: PaymentTransaction): string => {
  const lines = [
    `*🔔 NEW PAYMENT / RETAINER INITIATED*`,
    `----------------------------------------`,
    `*Client:* ${tx.clientName}`,
    `*Email:* ${tx.clientEmail}`,
    `*Phone/WhatsApp:* ${tx.clientPhone}`,
    `*Country:* ${tx.clientCountry}`,
    `----------------------------------------`,
    `*Service:* ${tx.serviceTitle}`,
    tx.packageTier ? `*Package:* ${tx.packageTier}` : '',
    `*Amount:* ${tx.amountBhd} BHD (~$${tx.amountUsd} USD)`,
    `*Gateway:* ${tx.gatewayName}`,
    `*Reference ID:* ${tx.referenceNumber}`,
    `*Status:* ${tx.status}`,
    `----------------------------------------`,
    `_Sent via Bab Al-Khaleej & Back for Brand Official Gateway_`,
  ].filter(Boolean);

  const message = lines.join('\n');
  return `https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export const generateEmailNotificationTemplate = (tx: PaymentTransaction): { subject: string; body: string } => {
  return {
    subject: `Official Payment Receipt & Confirmation [${tx.referenceNumber}] — ${tx.serviceTitle}`,
    body: `Dear ${tx.clientName},

Thank you for choosing Bab Al-Khaleej (Bahrain) & Back for Brand LLC (USA).

We have successfully recorded your transaction for:
Service: ${tx.serviceTitle}
Amount: ${tx.amountBhd} BHD / $${tx.amountUsd} USD
Payment Method: ${tx.gatewayName}
Reference ID: ${tx.referenceNumber}
Status: ${tx.status}

Our CEO, Ghazi Wazir, and our executive consulting team will follow up directly on your provided phone number (${tx.clientPhone}) and email with the official onboarding dossier and government filing schedule.

Kind regards,
Executive Desk · Bab Al-Khaleej & Back for Brand LLC
Phone / WhatsApp: ${GHAZI_INFO.phone}
Email: ${GHAZI_INFO.email}
Kingdom of Bahrain & Florida, USA`,
  };
};

/**
 * Real-time Cloud Firestore synchronization for Payment Transactions
 */
export const subscribeToTransactions = (callback: (txs: PaymentTransaction[]) => void): (() => void) => {
  const pathForOnSnapshot = 'transactions';
  try {
    return onSnapshot(
      collection(db, pathForOnSnapshot),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudTxs: PaymentTransaction[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as any;
            cloudTxs.push({
              id: d.id,
              clientName: data.clientName || 'Client',
              clientEmail: data.clientEmail || '',
              clientPhone: data.clientPhone || '',
              clientCountry: data.clientCountry || 'Bahrain',
              serviceId: data.serviceId || '',
              serviceTitle: data.serviceTitle || 'Service Retainer',
              packageTier: data.packageTier || '',
              amountBhd: Number(data.amountBhd) || 0,
              amountUsd: Number(data.amountUsd) || 0,
              gateway: data.gateway || 'benefit_pay',
              gatewayName: data.gatewayName || 'BenefitPay',
              status: data.status || 'SETTLED',
              referenceNumber: data.referenceNumber || d.id,
              fawriReference: data.fawriReference || '',
              notes: data.notes || '',
              timestamp: data.timestamp || new Date().toISOString(),
            });
          });
          if (cloudTxs.length > 0) {
            localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(cloudTxs));
            callback(cloudTxs);
          }
        }
      },
      (error) => {
        console.warn('[Firestore] Real-time transactions sync fallback to local cache:', error.message);
      }
    );
  } catch {
    return () => {};
  }
};

/**
 * Seed initial transactions into Cloud Firestore
 */
export const seedCloudTransactions = async (): Promise<boolean> => {
  try {
    for (const tx of INITIAL_TRANSACTIONS) {
      await setDoc(doc(db, 'transactions', tx.id), {
        id: tx.id,
        clientName: tx.clientName,
        clientEmail: tx.clientEmail,
        clientPhone: tx.clientPhone || '',
        clientCountry: tx.clientCountry || 'Bahrain',
        serviceId: tx.serviceId,
        serviceTitle: tx.serviceTitle,
        packageTier: tx.packageTier || '',
        amountBhd: tx.amountBhd,
        amountUsd: tx.amountUsd,
        gateway: tx.gateway,
        gatewayName: tx.gatewayName,
        status: tx.status,
        referenceNumber: tx.referenceNumber || tx.id,
        fawriReference: tx.fawriReference || '',
        notes: tx.notes || '',
        timestamp: tx.timestamp,
      });
    }
    return true;
  } catch (e) {
    console.warn('[Firestore] Transaction seeding error:', e);
    return false;
  }
};
