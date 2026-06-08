#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('expo/.env がありません。cp .env.example .env して Supabase の値を設定してください。');
  process.exit(1);
}

const raw = fs.readFileSync(envPath, 'utf8');
const url = (raw.match(/^EXPO_PUBLIC_SUPABASE_URL=(.+)$/m)?.[1] ?? '').trim();
const key = (raw.match(/^EXPO_PUBLIC_SUPABASE_ANON_KEY=(.+)$/m)?.[1] ?? '').trim();
if (!url || !key || url.includes('YOUR_PROJECT_REF') || key.includes('YOUR_ANON_KEY')) {
  console.error('expo/.env の EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY を本番値に設定してください。');
  process.exit(1);
}

console.log('OK: Supabase env found for release build');
