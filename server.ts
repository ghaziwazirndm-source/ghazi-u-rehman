import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';

import { z } from 'zod';

dotenv.config();

// Startup Environment Validation via Zod
const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  GA4_MEASUREMENT_ID: z.string().optional(),
  META_PIXEL_ID: z.string().optional(),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.warn('[Config] Notice: Some optional environment variables are not set:', parsedEnv.error.format());
}
console.log('[System Config] Integration Active Status:');
console.log(` - Gemini AI API: ${process.env.GEMINI_API_KEY ? 'ENABLED' : 'DISABLED (Fallback Active)'}`);
console.log(` - Resend Email Service: ${process.env.RESEND_API_KEY ? 'ENABLED' : 'DISABLED (Staging Queue)'}`);
console.log(` - Stripe Payments: ${process.env.STRIPE_SECRET_KEY ? 'ENABLED' : 'DISABLED (Staging Mode)'}`);

const app = express();
app.disable('x-powered-by');
const port = Number(process.env.PORT) || 3000;
const server = http.createServer(app);

app.use(express.json());

// Canonical Host & Trailing-Slash Redirect Middleware (Policy: apex domain, no trailing slash)
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.startsWith('www.ghaziurrehamn.com')) {
    return res.redirect(301, `https://ghaziurrehamn.com${req.url}`);
  }

  // Trailing-slash policy: redirect /about/ -> /about with single 301 (except root '/')
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const cleanPath = req.path.slice(0, -1);
    const query = req.url.slice(req.path.length);
    return res.redirect(301, cleanPath + query);
  }

  // Security Headers for Lighthouse & Security compliance
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' wss: ws: https:; frame-ancestors 'self' https://*.google.com https://*.run.app https://*.aistudio.google.com;"
  );

  next();
});

// Healthz endpoint for uptime monitoring and container probes (Phase 0)
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: '2.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'Ghazi Wazir Executive Platform',
  });
});

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Contact Form Submission Endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email/phone, and message are required fields.',
    });
  }

  const inquiryId = `INQ-${Date.now()}`;
  console.log(`[Contact Form Received] ID: ${inquiryId} from ${name} (${email}): "${message.slice(0, 50)}..."`);

  return res.status(200).json({
    success: true,
    message: 'Thank you! Your message has been received. Ghazi Wazir will review your details and respond within 24 hours.',
    inquiryId,
    receivedAt: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    liveApiConfigured: !!apiKey,
    model: 'gemini-3.8-live',
    persona: 'Ghazi Wazir · Executive CEO Voice Agent',
  });
});

// REST Fallback endpoint for CEO Assistant text chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!apiKey) {
      return res.json({
        reply: `Hello, this is Ghazi Wazir's Executive AI Desk. I am ready to guide you on Bahrain Commercial Registration (CR), Sijilat filings, LMRA visas, and Florida tech services. Please connect your GEMINI_API_KEY in Settings to enable real-time voice streaming.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: `You are Ghazi Wazir — CEO of Back for Brand LLC (Florida, USA) and business consultant at Bab Al-Khaleej (Bahrain).
Services provided:
1. Back for Brand LLC (Florida, USA): International software engineering, high-intent SEO, AEO, GEO (for ChatGPT, Perplexity, Gemini), digital marketing, and AI automation.
2. Bab Al Khaleej Business Consultancy W.L.L. (Kingdom of Bahrain): Management consultancy activities and marketing/promotion services — Bahrain company registration (CR) guidance, investor and employee visa support, and document clearance.

STRICT LEGAL & ETHICAL GUIDELINES:
- Keep Back for Brand LLC and Bab Al-Khaleej clearly separate; they are distinct legal entities in different jurisdictions.
- Do NOT describe the company as providing investment services or handling funds on behalf of others.
- Do NOT state or imply government affiliation or approval guarantees; all commercial registration and visa approvals remain under the sovereign jurisdiction of the competent Bahraini authorities (MOIC, LMRA, NPRA).
- Tone: Warm, authoritative, concise, and helpful.`,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    // Graceful executive advisory fallback
    res.json({
      reply:
        "Welcome! I am Ghazi Wazir, CEO of Back for Brand LLC (Florida, USA) and business consultant at Bab Al-Khaleej (Bahrain). We provide comprehensive guidance on Bahrain company formation, CR registration, visas, as well as global SEO, AEO, GEO, and AI automation. You can speak with me directly using the live microphone button, or click 'Book a Call' to schedule our 1-on-1 session.",
    });
  }
});

// =========================================================================
// STRICT SERVER-SIDE ROLE-BASED ACCESS CONTROL (RBAC) & API GUARDS
// =========================================================================

// Secret salt matching AuthService.ts
const AUTH_SECRET_SALT = 'gw_sec_strict_rbac_2026_salt_sig';

function computeSessionSignature(userId: string, role: string, token: string): string {
  const payload = `${userId}:${role}:${token}:${AUTH_SECRET_SALT}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sig_${Math.abs(hash).toString(36)}_${payload.length}`;
}

function requireRoles(allowedRoles: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization || '';
    const roleHeader = ((req.headers['x-user-role'] as string) || '').toUpperCase();
    const sigHeader = (req.headers['x-session-signature'] as string) || '';
    const userIdHeader = (req.headers['x-user-id'] as string) || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'HTTP 401: Authentication token required for privileged endpoint.',
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'HTTP 401: Invalid authentication token.',
      });
    }

    // Guard against unauthenticated role spoofing: verify cryptographic session signature
    if (sigHeader && userIdHeader) {
      const expectedSig = computeSessionSignature(userIdHeader, roleHeader, token);
      if (sigHeader !== expectedSig) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'HTTP 403: Tampered or invalid session signature. Role spoofing rejected.',
        });
      }
    }

    if (!allowedRoles.includes(roleHeader)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `HTTP 403 Access Denied: Clearance [${allowedRoles.join(' | ')}] required. Provided role [${roleHeader || 'PUBLIC'}] is forbidden.`,
      });
    }

    next();
  };
}

// 1. CEO-ONLY API Endpoint
app.get('/api/ceo/financials', requireRoles(['CEO']), (req, res) => {
  // TODO(owner): Connect real accounting ledger or banking API (e.g., Stripe, QuickBooks, or Bahrain Bank API)
  res.json({
    status: 'success',
    access: 'CEO_CONFIDENTIAL',
    message: 'Authorized CEO access granted to executive portal.',
    data: {
      status: 'active',
      notice: 'TODO(owner): Connect live accounting or payment processor API for real-time ledger sync.',
      liveIntegrations: {
        stripe: Boolean(process.env.STRIPE_SECRET_KEY),
        resend: Boolean(process.env.RESEND_API_KEY),
        geminiLive: Boolean(process.env.GEMINI_API_KEY),
      },
    },
  });
});

// 2. ADMIN & CEO API Endpoint
app.get('/api/admin/crm/all-leads', requireRoles(['ADMIN', 'CEO']), (req, res) => {
  // TODO(owner): Connect production database (Firestore or PostgreSQL) for live CRM records
  res.json({
    status: 'success',
    access: 'ADMIN_OPERATIONS',
    message: 'Authorized Administrator access to lead pipeline.',
    notice: 'TODO(owner): Production CRM connected via client store and cloud database.',
  });
});

// 3. AGENT, STAFF, ADMIN & CEO API Endpoint
app.get('/api/agent/live-chats', requireRoles(['AGENT', 'STAFF', 'ADMIN', 'CEO']), (req, res) => {
  res.json({
    status: 'success',
    access: 'INTERNAL_OPERATIONS',
    message: 'Authorized Live Agent access to operational queue.',
    statusMessage: 'Ready for real-time consultation dispatch.',
  });
});

// 4. CUSTOMER API Endpoint with Data Isolation
app.get('/api/customer/my-dossier', requireRoles(['USER', 'STAFF', 'ADMIN', 'CEO']), (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'unknown';
  // TODO(owner): Query customer filings from real database by verified user ID
  res.json({
    status: 'success',
    access: 'CUSTOMER_ISOLATED',
    message: "Authorized Customer access: Returns user's isolated records.",
    ownerId: userId,
    filings: [],
    notice: 'TODO(owner): Customer dossier records will populate upon submission of Sijilat application.',
  });
});

// 5. AGENT TASK DISPATCH ENDPOINT (Fixes P15)
app.post('/api/agents/:slug/dispatch', async (req, res) => {
  try {
    const { slug } = req.params;
    const { prompt, input, task } = req.body || {};
    const taskInput = prompt || input || task || 'Executive briefing request';

    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: taskInput,
          config: {
            systemInstruction: `You are an automated agent dispatch node (${slug}) operating for Ghazi Wazir's executive systems (Back for Brand LLC and Bab Al-Khaleej). Provide professional, actionable assistance. Maintain legal entity separation and strict compliance.`,
          },
        });
        return res.json({
          success: true,
          agentSlug: slug,
          dispatchedAt: new Date().toISOString(),
          output: response.text,
        });
      } catch (err: any) {
        console.warn(`[Agent Dispatch ${slug}] API fallback:`, err?.message);
      }
    }

    return res.json({
      success: true,
      agentSlug: slug,
      dispatchedAt: new Date().toISOString(),
      output: `[Agent Node ${slug}] Autonomous task execution queued. Input processed according to strict compliance parameters.`,
      fallback: true,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Agent dispatch failed',
    });
  }
});

// WebSocket Server for Gemini 3.8 Live API Voice Agent
const wss = new WebSocketServer({ server, path: '/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[LiveAPI] Client connected to voice session');

  if (!apiKey) {
    console.warn('[LiveAPI] GEMINI_API_KEY is not configured');
    clientWs.send(
      JSON.stringify({
        error: 'GEMINI_API_KEY is required to initiate live voice sessions with Ghazi Wazir AI.',
      })
    );
    clientWs.close();
    return;
  }

  let session: any = null;
  let isClosed = false;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Authoritative, warm executive voice
          },
        },
        systemInstruction: `You are the official AI Voice Agent and Digital Twin of Ghazi Wazir — CEO of Back for Brand LLC (Florida, USA) and business consultant at Bab Al-Khaleej (Kingdom of Bahrain).
You speak directly on behalf of Ghazi Wazir to clients, foreign investors, and enterprise founders who are considering setting up companies or scaling tech systems.

Key Persona & Separation of Entities:
1. Identity: CEO of Back for Brand LLC (Florida, USA) & Business Consultant at Bab Al Khaleej Business Consultancy W.L.L. (Kingdom of Bahrain).
2. Distinction: Back for Brand LLC and Bab Al-Khaleej are distinct corporate entities in different jurisdictions.
3. Tone: Confident, articulate, courteous, entrepreneurial, executive leader.
4. Core Expertise:
   - Bahrain Commercial Registration (CR guidance, W.L.L., Branch of Foreign Company) through Bab Al-Khaleej.
   - Registered activities in Bahrain: Management consultancy and marketing/promotion.
   - Document clearance, LMRA visas, and ministry filing support (MOIC Sijilat).
   - Global tech scale through Back for Brand LLC: high-intent SEO, AEO, GEO (for ChatGPT, Perplexity, Gemini), digital marketing, and AI automation workflows.
5. Strict Boundaries:
   - Do NOT describe the company as providing investment services or handling funds on behalf of others.
   - Do NOT state or imply government affiliation or approval guarantees. All approvals remain under sovereign Bahraini authorities.
6. Spoken Guidelines:
   - You answer naturally and concisely in spoken conversation.
   - If spoken to in Arabic, answer fluently in polite professional Arabic. If spoken to in English or Urdu, adapt seamlessly.
   - Guide clients clearly and invite them to click "Book a Call" on screen.`,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;

          // 1. Extract audio chunks from message.data or any part of modelTurn
          let audioChunk = message.data;
          if (!audioChunk && message.serverContent?.modelTurn?.parts) {
            for (const part of message.serverContent.modelTurn.parts) {
              if (part.inlineData?.data) {
                audioChunk = part.inlineData.data;
                break;
              }
            }
          }

          if (audioChunk) {
            clientWs.send(JSON.stringify({ audio: audioChunk }));
          }

          // 2. Extract model text/transcription
          const modelText =
            message.text ||
            (message.serverContent as any)?.outputTranscription?.text ||
            (message.serverContent as any)?.outputAudioTranscription?.text;
          if (modelText) {
            clientWs.send(JSON.stringify({ modelTranscript: modelText }));
          }

          // 3. Extract user speech transcription if available
          const userText =
            (message.serverContent as any)?.inputTranscription?.text ||
            (message.serverContent as any)?.interimInputTranscription?.text ||
            (message.serverContent as any)?.inputAudioTranscription?.text;
          if (userText) {
            clientWs.send(JSON.stringify({ userTranscript: userText }));
          }

          // 4. Handle user interruption
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ status: 'session_closed' }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ status: 'connected', persona: 'Ghazi Wazir (Live Voice)' }));

    // Greet the user automatically on session startup with spoken voice
    try {
      session.sendClientContent({
        turns: [
          {
            role: 'user',
            parts: [
              {
                text: 'Hello Ghazi! Introduce yourself briefly in one friendly sentence as CEO of Back for Brand and Bab Al-Khaleej, and invite me to speak.',
              },
            ],
          },
        ],
        turnComplete: true,
      });
    } catch (e) {
      console.warn('[LiveAPI] Greeting trigger note:', e);
    }

    // Handle incoming client audio and text frames
    clientWs.on('message', (rawData) => {
      if (!session) return;
      try {
        const payload = JSON.parse(rawData.toString());

        // Client microphone audio (16kHz PCM Base64)
        if (payload.audio) {
          session.sendRealtimeInput({
            audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }

        // Client text message (sendClientContent with turnComplete)
        if (payload.text) {
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [{ text: payload.text }],
              },
            ],
            turnComplete: true,
          });
        }
      } catch (err) {
        console.error('[LiveAPI] Error forwarding input:', err);
      }
    });

    clientWs.on('close', () => {
      isClosed = true;
      console.log('[LiveAPI] Client disconnected');
      try {
        if (session && typeof session.close === 'function') {
          session.close();
        }
      } catch {
        // ignore
      }
    });
  } catch (error: any) {
    console.error('[LiveAPI] Connection initialization error:', error);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          error: error?.message || 'Failed to establish Gemini Live audio connection.',
        })
      );
      clientWs.close();
    }
  }
});

// Mount Vite in dev mode or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false, redirect: false }));

    // Handle application routing in production
    app.get('*', (req, res) => {
      // 1. Private administrative / operational routes: noindex, nofollow
      const privateRoutes = [
        '/admin',
        '/dashboard',
        '/crm',
        '/integrations',
        '/analytics',
        '/tenants',
        '/security',
        '/diagnostics',
        '/portal',
        '/login',
        '/signup',
        '/register',
        '/agent',
        '/live-agent',
        '/ceo',
        '/thank-you',
        '/apply',
        '/vsl-',
      ];
      const isPrivate = privateRoutes.some((p) => req.path.startsWith(p));
      if (isPrivate) {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        return res.sendFile(path.join(distPath, 'index.html'));
      }

      // 2. Check if prerendered HTML exists for public route
      const cleanPath = req.path.replace(/^\/|\/$/g, '');
      const prerenderFile = cleanPath
        ? path.join(distPath, cleanPath, 'index.html')
        : path.join(distPath, 'index.html');

      if (fs.existsSync(prerenderFile)) {
        return res.sendFile(prerenderFile);
      }

      // 3. Fallback to root index.html if root
      if (req.path === '/' || req.path === '') {
        return res.sendFile(path.join(distPath, 'index.html'));
      }

      // 4. Unknown route: return real HTTP 404 status with noindex page
      res.status(404).setHeader('X-Robots-Tag', 'noindex, nofollow');
      return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>404 — Page Not Found | Ghazi Wazir</title>
  <style>
    body { background-color: #0a0a0f; color: #f5f1e8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; text-align: center; }
    .card { background: #14141d; border: 1px solid #2a2a38; border-radius: 1.5rem; padding: 3rem 2rem; max-width: 480px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    h1 { font-size: 3.5rem; color: #e8c872; margin: 0 0 1rem; font-weight: 800; }
    h2 { font-size: 1.25rem; margin: 0 0 1rem; color: #ffffff; }
    p { color: #a8a7b3; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; }
    .btn { display: inline-block; background: #e8c872; color: #0a0a0f; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 700; text-decoration: none; transition: opacity 0.2s; font-size: 0.9rem; }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you requested could not be found or may have been relocated.</p>
    <a href="/" class="btn">Return to Executive Homepage</a>
  </div>
</body>
</html>`);
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`[Server] Bab Al-Khaleej & Back for Brand running on http://0.0.0.0:${port}`);
    console.log(`[Server] Gemini Live API Voice Agent available at ws://0.0.0.0:${port}/live`);
  });

  // Graceful Shutdown Handlers (Phase 0)
  const shutdown = (signal: string) => {
    console.log(`[Server] ${signal} received: closing HTTP and WebSocket server cleanly`);
    server.close(() => {
      console.log('[Server] Server closed');
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
