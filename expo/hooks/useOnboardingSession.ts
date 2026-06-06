import { useEffect, useState } from 'react';
import {
  getOnboardingSessionVersion,
  subscribeOnboardingSession,
} from '@/utils/onboardingStorage';

/** オンボードセッションが変わったときに再レンダーする */
export function useOnboardingSessionVersion(): number {
  const [version, setVersion] = useState(getOnboardingSessionVersion);

  useEffect(() => subscribeOnboardingSession(() => {
    setVersion(getOnboardingSessionVersion());
  }), []);

  return version;
}
