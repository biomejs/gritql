import { revalidateTag } from 'next/cache';

import { PATTERNS_CACHE_KEY } from '@/libs/patterns';

export async function POST() {
  revalidateTag(PATTERNS_CACHE_KEY, 'max');

  return Response.json({
    ok: true,
  });
}
