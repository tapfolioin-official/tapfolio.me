import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

const _adminAny = admin as any;
const existingApps = _adminAny.apps || [];

if (!existingApps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: _adminAny.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('[FIREBASE] Admin initialized successfully via environment variables.');
    } catch (e) {
      console.error('[FIREBASE] Failed to initialize via environment variables:', e);
    }
  } else {
    // Attempt local service account file fallback (only if present)
    try {
      const servicePath = path.join(process.cwd(), 'firebase-service-account.json');
      if (fs.existsSync(servicePath)) {
        const raw = fs.readFileSync(servicePath, 'utf8');
        const serviceAccount = JSON.parse(raw);
        admin.initializeApp({
          credential: _adminAny.credential.cert(serviceAccount),
        });
        console.log('[FIREBASE] Admin initialized successfully via local JSON file.');
      } else {
        console.warn('[FIREBASE] Warning: Firebase credentials not found. Push notifications will be logged/mocked.');
      }
    } catch (e) {
      console.warn('[FIREBASE] Warning: Failed to initialize local Firebase credentials.', e);
    }
  }
}

export default admin;
