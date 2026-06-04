import { normalizeSystemPath } from '@/utils/deepLinks';

export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}) {
  return normalizeSystemPath(path);
}
