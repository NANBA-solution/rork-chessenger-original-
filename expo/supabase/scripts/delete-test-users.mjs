#!/usr/bin/env node
/**
 * デバッグ用テストアカウントを削除（要 SUPABASE_SERVICE_ROLE_KEY）
 * 使い方: cd expo && SUPABASE_SERVICE_ROLE_KEY=eyJ... node supabase/scripts/delete-test-users.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const envPath = join(root, '.env');

function loadEnv() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

loadEnv();

const url = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim();
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

if (!url || !serviceKey) {
  console.error('EXPO_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が必要です。');
  console.error('Supabase Dashboard → Settings → API → service_role key を一時的に渡してください。');
  process.exit(1);
}

const TEST_EMAIL_RE = /^test-\d+@example\.com$/i;

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

let page = 1;
const perPage = 200;
const toDelete = [];

while (true) {
  const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
  if (error) {
    console.error('listUsers failed:', error.message);
    process.exit(1);
  }
  for (const u of data.users) {
    if (u.email && TEST_EMAIL_RE.test(u.email)) toDelete.push(u);
  }
  if (data.users.length < perPage) break;
  page += 1;
}

if (toDelete.length === 0) {
  console.log('削除対象のテストユーザーはありません（test-*@example.com）');
  process.exit(0);
}

console.log(`削除対象 ${toDelete.length} 件:`);
for (const u of toDelete) console.log(' -', u.email, u.id);

for (const u of toDelete) {
  const { error } = await admin.auth.admin.deleteUser(u.id);
  if (error) {
    console.error('削除失敗', u.email, error.message);
    process.exit(1);
  }
  console.log('削除OK', u.email);
}

console.log('完了');
