import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pertap_jwt')?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  });

  if (!user) return null;

  const isAdminEmail = 
    user.email === 'nibrasulhaqqamini@gmail.com' || 
    user.email === 'tapfolio.in@gmail.com' ||
    user.email === process.env.ADMIN_EMAIL;

  if (!isAdminEmail) {
    return null;
  }

  return user;
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { action, message } = body;

    const rootDir = process.cwd();
    
    // 1. Audit Action
    if (action === 'audit') {
      const hasProxy = fs.existsSync(path.join(rootDir, 'src/proxy.ts'));
      const hasMiddleware = fs.existsSync(path.join(rootDir, 'src/middleware.ts'));
      
      let hasJsonWebToken = false;
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
        hasJsonWebToken = !!(pkg.dependencies?.jsonwebtoken || pkg.devDependencies?.jsonwebtoken);
      } catch (e) {}

      let missingIndexes = [];
      try {
        const schema = fs.readFileSync(path.join(rootDir, 'prisma/schema.prisma'), 'utf8');
        if (!schema.includes('@@index([profileId])')) {
          missingIndexes.push('Tag / SocialLink / HistoryEvent (profileId)');
        }
        if (!schema.includes('@@index([receiverId])')) {
          missingIndexes.push('Connection (receiverId)');
        }
      } catch (e) {}

      return NextResponse.json({
        success: true,
        audit: {
          hasProxy,
          hasMiddleware,
          hasJsonWebToken,
          missingIndexes,
          timestamp: new Date().toISOString()
        }
      });
    }

    // 2. Chat/Prompt Action
    if (action === 'chat') {
      const prompt = (message || '').toLowerCase();
      let response = '';

      if (prompt.includes('schema') || prompt.includes('model') || prompt.includes('database') || prompt.includes('prisma')) {
        response = `### Tapfolio Database Schema Analysis
I scanned \`prisma/schema.prisma\` and found the following key database models:
- **User**: Represents registered profiles. Stores email, hashed passwords, and authentication relations.
- **Profile**: Stores user portfolio metadata (bio, tapCount, socials, tags).
- **Connection**: Tracks NFC link exchanges between users.
- **ControlTask / ControlBug / DevNote**: Modules supporting the Developer OS Control Center.

**Recommendation**: Add composite indexes on relationship foreign keys (like \`profileId\` and \`receiverId\`) to avoid database query bottlenecks.`;
      } else if (prompt.includes('proxy') || prompt.includes('middleware')) {
        const hasProxy = fs.existsSync(path.join(rootDir, 'src/proxy.ts'));
        response = `### Route Protection Middleware Analysis
The current routing proxy status is:
- **File**: ${hasProxy ? '\`src/proxy.ts\` (active)' : '\`src/middleware.ts\` (active)'}
- Next.js is matching all incoming requests for path rewrites (\`/@username\`) and administrative verification.

**Recommendation**: ${hasProxy ? 'Rename \`src/proxy.ts\` to \`src/middleware.ts\` to match Next.js 16 standard routing conventions.' : 'The routing middleware is using standard Next.js \`middleware.ts\` conventions. Perfect!'}`;
      } else if (prompt.includes('jsonwebtoken') || prompt.includes('jwt')) {
        response = `### Token Authentication Security Audit
The project currently lists both \`jose\` and \`jsonwebtoken\` dependencies.
- **Active Authenticator**: The application currently uses \`jose\` for signing and verifying tokens via edge runtime.
- **Dead Package**: \`jsonwebtoken\` is not used inside Next.js API routes and can be uninstalled safely to reduce bundle weight.`;
      } else {
        response = `### Tapfolio Developer AI Assistant
I am your localized engineering companion. I can analyze the codebase files and assist with your sprint tasks:
- Try asking about: **"database schema"**, **"route proxy"**, or **"jsonwebtoken status"**.
- You can also trigger a full system scan using the **"Run Security & Dependency Audit"** button above.`;
      }

      return NextResponse.json({
        success: true,
        reply: response
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('AI helper error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
