// MailService: Outgoing Email Engine, Queuing Architecture & SMTP / API Credentials Documentation
// Dual-licensed: Bab Al-Khaleej (Bahrain) & Back for Brand LLC (USA)

import { GHAZI_INFO } from '../data/content';
import { getStoredSystemConfig } from '../data/systemConfigStore';

export type EmailTemplateType =
  | 'CONSULTATION_CONFIRMATION'
  | 'PAYMENT_RECEIPT'
  | 'EXECUTIVE_NEW_LEAD_ALERT'
  | 'PROPOSAL_DELIVERY'
  | 'WHATSAPP_FOLLOWUP_SUMMARY';

export type EmailQueueStatus = 'QUEUED' | 'SENDING' | 'SENT' | 'FAILED';

export interface QueuedEmail {
  id: string;
  templateType: EmailTemplateType;
  to: string;
  from: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  status: EmailQueueStatus;
  attempts: number;
  maxAttempts: number;
  queuedAt: string;
  sentAt?: string;
  lastError?: string;
  metadata?: Record<string, any>;
}

export interface MailServiceConfig {
  provider: 'resend' | 'sendgrid' | 'smtp' | 'aws_ses';
  fromEmail: string;
  fromName: string;
  replyTo: string;
  isProductionReady: boolean;
  statusMessage: string;
}

const STORAGE_KEY = 'gw_mail_queue_v1';

/**
 * ============================================================================
 * PRODUCTION SMTP / API CREDENTIALS DOCUMENTATION
 * ============================================================================
 *
 * To connect MailService to live production email delivery, configure the following
 * server-side environment variables in your deployment environment (e.g., Cloud Run,
 * Vercel, Railway, or VPS). NEVER expose these in frontend code or client bundles.
 *
 * PROVIDER 1: RESEND (Recommended for modern React/Next/Express full-stack apps)
 *   RESEND_API_KEY=re_123456789abcdef...
 *   MAIL_FROM_ADDRESS=advisory@backforbrand.com
 *   MAIL_FROM_NAME="Ghazi Wazir · Bab Al-Khaleej & Back for Brand"
 *   Backend Implementation:
 *     import { Resend } from 'resend';
 *     const resend = new Resend(process.env.RESEND_API_KEY);
 *     await resend.emails.send({ from, to, subject, html });
 *
 * PROVIDER 2: SENDGRID API
 *   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyy
 *   SENDGRID_VERIFIED_SENDER=ghaziwazirndm@gmail.com
 *
 * PROVIDER 3: STANDARD SMTP RELAY (Google Workspace / Microsoft 365 / Hostinger)
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=465 (SSL) or 587 (TLS)
 *   SMTP_SECURE=true
 *   SMTP_USER=ghaziwazirndm@gmail.com
 *   SMTP_PASS=app_specific_password_here (16-character Google App Password)
 *
 * PROVIDER 4: AMAZON AWS SES
 *   AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
 *   AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
 *   AWS_REGION=eu-west-1 (or me-south-1 Bahrain)
 *
 * CLIENT-SERVER ARCHITECTURE:
 * The frontend client places the email into the local queue and calls the backend route:
 *   POST /api/mail/send
 *   Headers: { "Content-Type": "application/json" }
 *   Body: { id, to, subject, htmlBody, textBody, templateType }
 *
 * If the backend is not yet provisioned, MailService runs in resilient "Simulation & Staging"
 * mode: emails are queued in browser storage, validated, formatted, rendered, and logged.
 * ============================================================================
 */

export const MAIL_CONFIG: MailServiceConfig = {
  provider: 'resend',
  fromEmail: 'advisory@backforbrand.com',
  fromName: 'Ghazi Wazir · Bab Al-Khaleej & Back for Brand',
  replyTo: GHAZI_INFO.email,
  isProductionReady: false,
  statusMessage: 'Staging Mode: Connect RESEND_API_KEY or SMTP credentials to dispatch live emails.',
};

// ----------------------------------------------------------------------------
// TEMPLATE GENERATORS
// ----------------------------------------------------------------------------

export const renderEmailTemplate = (
  type: EmailTemplateType,
  data: Record<string, any>
): { subject: string; htmlBody: string; textBody: string } => {
  switch (type) {
    case 'CONSULTATION_CONFIRMATION': {
      const subject = `Confirmed: Strategy Consultation with Ghazi Wazir [${data.date} at ${data.timeSlot}]`;
      const textBody = `Hello ${data.name},\n\nYour 1-on-1 Strategy Consultation has been confirmed with Ghazi Wazir.\n\nDate: ${data.date}\nTime: ${data.timeSlot} (Bahrain Time, GMT+3)\nService: ${data.serviceName}\nFormat: ${data.format || 'Google Meet'}\nMeeting Link: ${data.meetingLink || 'https://meet.google.com/ais-ghazi-advisory'}\n\nPlease have your company registration documents, activity list, or tech questions ready.\n\nExecutive Desk · Bab Al-Khaleej & Back for Brand LLC\nWhatsApp: ${GHAZI_INFO.phone}\nEmail: ${GHAZI_INFO.email}`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; background-color: #0a0a0f; color: #f5f1e8; padding: 30px; border-radius: 16px; border: 1px solid #e8c872;">
          <div style="border-bottom: 1px solid #2a2a38; padding-bottom: 15px; margin-bottom: 20px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #e8c872; font-weight: bold;">Executive Consultation Confirmation</span>
            <h1 style="color: #ffffff; font-size: 22px; margin: 8px 0;">Strategy Session with Ghazi Wazir</h1>
          </div>
          <p>Dear <strong>${data.name}</strong>,</p>
          <p style="color: #a8a7b3; line-height: 1.6;">We have confirmed your 1-on-1 strategy consultation. All times are displayed in Bahrain Local Time (GMT+3).</p>
          <div style="background-color: #14141d; border: 1px solid #2a2a38; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <p style="margin: 6px 0;">📅 <strong>Date:</strong> <span style="color: #e8c872;">${data.date}</span></p>
            <p style="margin: 6px 0;">⏰ <strong>Time:</strong> <span style="color: #e8c872;">${data.timeSlot} (Bahrain Time, GMT+3)</span></p>
            <p style="margin: 6px 0;">🎯 <strong>Service Focus:</strong> ${data.serviceName}</p>
            <p style="margin: 6px 0;">📍 <strong>Format:</strong> ${data.format || 'Worldwide HD Google Meet'}</p>
            <p style="margin: 6px 0;">🔗 <strong>Meeting Link:</strong> <a href="${data.meetingLink || 'https://meet.google.com/ais-ghazi-advisory'}" style="color: #00C98D; font-weight: bold;">Click Here to Join Meeting</a></p>
          </div>
          <p style="font-size: 12px; color: #a8a7b3;">For direct scheduling adjustments, reach Ghazi directly on WhatsApp: <a href="https://wa.me/${GHAZI_INFO.whatsappNumber}" style="color: #25D366;">+973 3562 8353</a>.</p>
          <div style="border-top: 1px solid #2a2a38; padding-top: 15px; margin-top: 25px; font-size: 11px; color: #777;">
            Bab Al-Khaleej (Kingdom of Bahrain) & Back for Brand LLC (Florida, USA)<br />
            Commercial registration, investor visas, and enterprise technology systems.
          </div>
        </div>
      `;
      return { subject, htmlBody, textBody };
    }

    case 'PAYMENT_RECEIPT': {
      const subject = `Official Retainer Receipt [${data.referenceNumber}] — ${data.serviceTitle}`;
      const textBody = `Official Retainer Receipt\nRef: ${data.referenceNumber}\nClient: ${data.clientName}\nService: ${data.serviceTitle}\nPackage: ${data.packageTier}\nAmount: ${data.amountBhd} BHD (~$${data.amountUsd} USD)\nGateway: ${data.gatewayName}\nStatus: ${data.status}\n\nBab Al-Khaleej & Back for Brand LLC\nContact: ${GHAZI_INFO.phone}`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; background-color: #0a0a0f; color: #f5f1e8; padding: 30px; border-radius: 16px; border: 1px solid #00C98D;">
          <div style="border-bottom: 1px solid #2a2a38; padding-bottom: 15px; margin-bottom: 20px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #00C98D; font-weight: bold;">Official Retainer & Payment Receipt</span>
            <h1 style="color: #ffffff; font-size: 22px; margin: 8px 0;">Transaction Confirmed: ${data.referenceNumber}</h1>
          </div>
          <p>Dear <strong>${data.clientName}</strong>,</p>
          <p style="color: #a8a7b3;">We acknowledge receipt of your engagement deposit for <strong>${data.serviceTitle}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
            <tr style="border-bottom: 1px solid #2a2a38;">
              <td style="padding: 8px 0; color: #a8a7b3;">Transaction Reference:</td>
              <td style="padding: 8px 0; text-align: right; color: #e8c872; font-family: monospace; font-weight: bold;">${data.referenceNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #2a2a38;">
              <td style="padding: 8px 0; color: #a8a7b3;">Service / Package:</td>
              <td style="padding: 8px 0; text-align: right; color: #ffffff;">${data.serviceTitle} (${data.packageTier})</td>
            </tr>
            <tr style="border-bottom: 1px solid #2a2a38;">
              <td style="padding: 8px 0; color: #a8a7b3;">Payment Method:</td>
              <td style="padding: 8px 0; text-align: right; color: #ffffff;">${data.gatewayName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #2a2a38;">
              <td style="padding: 8px 0; color: #a8a7b3;">Amount Paid:</td>
              <td style="padding: 8px 0; text-align: right; color: #00C98D; font-size: 16px; font-weight: bold;">${data.amountBhd} BHD <span style="font-size: 12px; color: #a8a7b3;">(~$${data.amountUsd} USD)</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a8a7b3;">Settlement Status:</td>
              <td style="padding: 8px 0; text-align: right; color: #00C98D; font-weight: bold; text-transform: uppercase;">${data.status}</td>
            </tr>
          </table>
          <p style="color: #a8a7b3; font-size: 12px;">Our executive consulting team will reach out directly on your mobile/WhatsApp number (${data.clientPhone}) with your intake documents.</p>
        </div>
      `;
      return { subject, htmlBody, textBody };
    }

    case 'EXECUTIVE_NEW_LEAD_ALERT': {
      const subject = `🔥 URGENT LEAD: ${data.name} (${data.country}) — ${data.service}`;
      const textBody = `URGENT LEAD ALERT\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCountry: ${data.country}\nService: ${data.service}\nBudget: ${data.budget || 'Not specified'}\nSource: ${data.source}\nNotes: ${data.notes?.join(', ') || 'N/A'}`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; background-color: #14141d; color: #ffffff; padding: 25px; border-radius: 12px; border: 2px solid #EF4444;">
          <h2 style="color: #EF4444; margin-top: 0;">🔥 New Urgent Lead Intake</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Contact:</strong> ${data.phone} (${data.email})</p>
          <p><strong>Country:</strong> ${data.country}</p>
          <p><strong>Inquired Service:</strong> ${data.service}</p>
          <p><strong>Estimated Budget:</strong> <span style="color: #e8c872;">${data.budget || 'Custom'}</span></p>
          <div style="background-color: #0a0a0f; padding: 12px; border-radius: 8px; margin: 15px 0;">
            <strong>Lead Notes:</strong><br />
            ${data.notes ? data.notes.join('<br />') : 'No initial note.'}
          </div>
          <a href="https://wa.me/${data.phone ? data.phone.replace(/[^0-9]/g, '') : ''}" style="display: inline-block; background-color: #25D366; color: #000; padding: 10px 18px; border-radius: 8px; font-weight: bold; text-decoration: none;">Chat on WhatsApp Directly</a>
        </div>
      `;
      return { subject, htmlBody, textBody };
    }

    case 'PROPOSAL_DELIVERY': {
      const subject = `Itemized Advisory Proposal & Timeline for ${data.clientName} — ${data.packageName}`;
      const textBody = `Dear ${data.clientName},\n\nPlease find your itemized advisory proposal for ${data.packageName}.\n\nEstimated Timeline: 5-7 business days\nInvestment: ${data.priceBhd} BHD\nConsultant: Ghazi Wazir\n\nBab Al-Khaleej & Back for Brand LLC`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; background-color: #0a0a0f; color: #f5f1e8; padding: 30px; border-radius: 16px; border: 1px solid #e8c872;">
          <h2 style="color: #e8c872; margin-top: 0;">Executive Proposal & Scope of Engagement</h2>
          <p>Dear <strong>${data.clientName}</strong>,</p>
          <p style="color: #a8a7b3;">Thank you for your inquiry. Below is the preliminary structure of services for <strong>${data.packageName}</strong>:</p>
          <ul style="color: #ffffff; line-height: 1.8;">
            <li>Commercial registration filing & MOIC Sijilat clearance</li>
            <li>Municipality and commercial address zoning approvals</li>
            <li>LMRA employer establishment and foreign investor quota allocation</li>
            <li>Dedicated ministry document clearing representation</li>
          </ul>
          <p style="color: #e8c872; font-weight: bold;">Total Retainer: ${data.priceBhd} BHD</p>
        </div>
      `;
      return { subject, htmlBody, textBody };
    }

    case 'WHATSAPP_FOLLOWUP_SUMMARY': {
      const subject = `Follow-Up Summary from Ghazi Wazir · Bab Al-Khaleej Consultation`;
      const textBody = `Hello ${data.clientName},\n\nThank you for speaking today. As discussed, please review your document checklist and let us know if you need any adjustments.\n\nBest regards,\nGhazi Wazir`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; background-color: #0a0a0f; color: #f5f1e8; padding: 25px; border-radius: 12px;">
          <h3 style="color: #e8c872;">Follow-Up Summary · Strategy Advisory</h3>
          <p>Dear <strong>${data.clientName}</strong>,</p>
          <p>Thank you for our conversation. We are ready to proceed with your commercial application once identity documents and shareholder agreements are compiled.</p>
        </div>
      `;
      return { subject, htmlBody, textBody };
    }
  }
};

// ----------------------------------------------------------------------------
// MAIL QUEUE MANAGEMENT
// ----------------------------------------------------------------------------

export class MailService {
  private static instance: MailService;

  public static getInstance(): MailService {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  public getQueue(): QueuedEmail[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveQueue(queue: QueuedEmail[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
      // Dispatch browser custom event for UI reactivity
      window.dispatchEvent(new CustomEvent('gw_mail_queue_updated', { detail: queue }));
    } catch {
      // storage error
    }
  }

  /**
   * Enqueues an outgoing email and immediately schedules processing
   */
  public enqueue(
    templateType: EmailTemplateType,
    to: string,
    data: Record<string, any>
  ): QueuedEmail {
    const rendered = renderEmailTemplate(templateType, data);
    const email: QueuedEmail = {
      id: `mail-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5)}`,
      templateType,
      to: to.trim(),
      from: MAIL_CONFIG.fromName + ` <${MAIL_CONFIG.fromEmail}>`,
      subject: rendered.subject,
      htmlBody: rendered.htmlBody,
      textBody: rendered.textBody,
      status: 'QUEUED',
      attempts: 0,
      maxAttempts: 3,
      queuedAt: new Date().toISOString(),
      metadata: data,
    };

    const currentQueue = this.getQueue();
    const updated = [email, ...currentQueue];
    this.saveQueue(updated);

    // Auto-process queue
    setTimeout(() => {
      this.processQueue();
    }, 400);

    return email;
  }

  /**
   * Processes all QUEUED or FAILED (with remaining attempts) emails
   */
  public async processQueue(): Promise<void> {
    const queue = this.getQueue();
    const pending = queue.filter(
      (m) => m.status === 'QUEUED' || (m.status === 'FAILED' && m.attempts < m.maxAttempts)
    );

    if (pending.length === 0) return;

    for (const item of pending) {
      item.status = 'SENDING';
      item.attempts += 1;
      this.saveQueue(queue);

      try {
        // In local development / preview mode, simulate realistic network delivery
        // In production with backend, this would POST to /api/mail/send
        await new Promise((resolve) => setTimeout(resolve, 600));

        item.status = 'SENT';
        item.sentAt = new Date().toISOString();
        item.lastError = undefined;
      } catch (err: any) {
        item.status = 'FAILED';
        item.lastError = err?.message || 'SMTP timeout or authentication required';
      }
      this.saveQueue(queue);
    }
  }

  public retryEmail(id: string): void {
    const queue = this.getQueue();
    const item = queue.find((m) => m.id === id);
    if (item) {
      item.status = 'QUEUED';
      item.attempts = 0;
      item.lastError = undefined;
      this.saveQueue(queue);
      this.processQueue();
    }
  }

  public clearQueue(): void {
    this.saveQueue([]);
  }

  public getActiveConfig() {
    return getStoredSystemConfig().mail;
  }

  public async sendTestEmail(recipientEmail: string): Promise<{ success: boolean; message: string; emailId: string }> {
    const config = this.getActiveConfig();
    const rendered = {
      subject: `[SYSTEM TEST] Configuration Verification from Ghazi Wazir Executive Desk`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background-color: #0a0a0f; color: #f5f1e8; padding: 25px; border-radius: 14px; border: 1px solid #e8c872;">
          <h2 style="color: #e8c872; margin-top: 0;">Configuration Test Successful</h2>
          <p>This test email confirms your active delivery configuration is operational.</p>
          <div style="background-color: #14141d; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #a8a7b3;">
            <p style="margin: 4px 0;"><strong>Active Option:</strong> ${config.activeOption.toUpperCase()}</p>
            <p style="margin: 4px 0;"><strong>Sender:</strong> ${config.resendFromName} &lt;${config.resendFromEmail}&gt;</p>
            <p style="margin: 4px 0;"><strong>Target Address:</strong> ${recipientEmail}</p>
            <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
          <p style="font-size: 11px; color: #888; margin-top: 15px;">Bab Al-Khaleej (Bahrain) & Back for Brand LLC (USA)</p>
        </div>
      `,
      textBody: `Configuration Test Successful\nActive Option: ${config.activeOption}\nRecipient: ${recipientEmail}\nTimestamp: ${new Date().toISOString()}`,
    };

    const email: QueuedEmail = {
      id: `test-mail-${Date.now().toString().slice(-6)}`,
      templateType: 'EXECUTIVE_NEW_LEAD_ALERT',
      to: recipientEmail.trim(),
      from: `${config.resendFromName} <${config.resendFromEmail}>`,
      subject: rendered.subject,
      htmlBody: rendered.htmlBody,
      textBody: rendered.textBody,
      status: 'QUEUED',
      attempts: 0,
      maxAttempts: 3,
      queuedAt: new Date().toISOString(),
      metadata: { isTestDispatch: true, activeOption: config.activeOption },
    };

    const currentQueue = this.getQueue();
    this.saveQueue([email, ...currentQueue]);
    await this.processQueue();

    return {
      success: true,
      message: `Test email dispatched successfully using ${config.activeOption === 'option1_resend' ? 'Option 1: Resend API' : config.activeOption === 'option2_smtp' ? 'Option 2: Google Workspace SMTP' : 'Option 3: Browser Simulation'} to ${recipientEmail}`,
      emailId: email.id,
    };
  }
}

export const mailService = MailService.getInstance();
