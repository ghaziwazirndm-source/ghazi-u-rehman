// Bahrain Registration Roadmap Document & Print / PDF Generator
import { GHAZI_INFO } from '../data/content';

export interface GenerateRoadmapPdfOptions {
  entityType?: string;
  activityType?: string;
  totalWorkingDays?: number;
  startDateStr?: string;
  targetCompletionDate?: string;
  milestones?: Array<{
    stepNumber?: number;
    title?: string;
    authority?: string;
    phaseTitle?: string;
    calculatedDays?: number;
    description?: string;
    proTip?: string;
  }>;
  serviceTitle?: string;
}

export function generateBahrainRoadmapPdf(options: GenerateRoadmapPdfOptions): boolean {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return true;
    }

    const milestonesHtml = (options.milestones || [])
      .map(
        (m) => `
        <div style="border-bottom: 1px solid #e2e8f0; padding: 12px 0;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="color: #0f172a; font-size: 14px;">Step ${m.stepNumber || '•'}: ${m.title || ''}</strong>
            <span style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 11px; color: #475569;">${m.authority || ''}</span>
          </div>
          <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">${m.description || ''}</p>
          ${m.proTip ? `<p style="font-size: 11px; color: #b45309; margin: 4px 0 0 0;"><em>Note: ${m.proTip}</em></p>` : ''}
        </div>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${options.serviceTitle || 'Bahrain Registration Roadmap'}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; }
            h1 { font-size: 22px; color: #0f172a; margin-bottom: 4px; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
            .meta { display: flex; gap: 20px; font-size: 12px; color: #475569; margin-top: 10px; }
            .meta div { background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${options.serviceTitle || 'Commercial Registration Execution Roadmap'}</h1>
            <div style="font-size: 13px; color: #64748b;">Bab Al-Khaleej Commercial Services · Kingdom of Bahrain</div>
            <div class="meta">
              <div><strong>Target Duration:</strong> ${options.totalWorkingDays || 14} Working Days</div>
              <div><strong>Commencement:</strong> ${options.startDateStr || 'Immediate'}</div>
              <div><strong>Estimated Completion:</strong> ${options.targetCompletionDate || 'On Schedule'}</div>
            </div>
          </div>
          <div>${milestonesHtml}</div>
          <div class="footer">
            <p>Direct Executive Advisory: ${GHAZI_INFO.name} (${GHAZI_INFO.roleTitle}) · WhatsApp/Direct: ${GHAZI_INFO.phone}</p>
            <p>Bab Al-Khaleej Commercial Services & Back for Brand LLC · Sovereign Client Protection</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);

    return true;
  } catch (err) {
    console.error('Roadmap print error:', err);
    return false;
  }
}
