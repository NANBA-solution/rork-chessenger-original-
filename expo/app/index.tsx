import React from 'react';
import { GuestBootRedirect } from '@/components/GuestBootRedirect';

/**
 * 起動振り分け: 未オンボード → オンボード / 未登録 → 登録 / 登録済み → ホーム
 */
export default function AppIndex() {
  return <GuestBootRedirect />;
}
