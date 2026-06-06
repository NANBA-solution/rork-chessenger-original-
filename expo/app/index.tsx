import React from 'react';
import { GuestBootRedirect } from '@/components/GuestBootRedirect';

/**
 * 起動振り分け: 未登録は毎回オンボード → 同一セッションで登録 / 登録済み → ホーム
 */
export default function AppIndex() {
  return <GuestBootRedirect />;
}
