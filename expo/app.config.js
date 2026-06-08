/** @type {import('expo/config').ExpoConfig} */
const appJson = require('./app.json');

function sanitizeEnv(value) {
  return String(value ?? '').trim().replace(/^["']|["']$/g, '');
}

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      supabaseUrl: sanitizeEnv(process.env.EXPO_PUBLIC_SUPABASE_URL),
      supabaseAnonKey: sanitizeEnv(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
    },
  },
};
