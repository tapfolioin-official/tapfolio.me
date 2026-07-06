import fs from 'fs';
import path from 'path';

// Load .env file manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

import prisma from './src/lib/db';

async function main() {
  const profile = await prisma.profile.findFirst({
    where: { username: 'nibras' },
    include: { tags: true }
  });
  console.log('Profile:', JSON.stringify(profile, null, 2));
}
main();
