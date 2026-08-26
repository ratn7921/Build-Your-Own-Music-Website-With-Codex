import { NextRequest, NextResponse } from 'next/server';

const seen = new Map<string, number>();
const WINDOW_MS = 60_000;

async function kv(command: string[]) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const response = await fetch(`${url}/${command.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
  });
  if (!response.ok) throw new Error('KV request failed');
  return response.json() as Promise<{ result: unknown }>;
}

export async function POST(request: NextRequest) {
  const { id } = await request.json().catch(() => ({}));
  const visitor = typeof id === 'string' && id.length < 100 ? id : crypto.randomUUID();
  const now = Date.now();
  try {
    if (process.env.KV_REST_API_URL) {
      await kv(['zadd', 'midnight-relay:presence', String(now), visitor]);
      await kv(['zremrangebyscore', 'midnight-relay:presence', '0', String(now - WINDOW_MS)]);
      const total = await kv(['zcount', 'midnight-relay:presence', String(now - WINDOW_MS), '+inf']);
      return NextResponse.json({ count: Number(total?.result || 1) });
    }
  } catch { /* A local fallback keeps the scene usable when KV is unavailable. */ }
  seen.set(visitor, now);
  for (const [key, time] of seen) if (time < now - WINDOW_MS) seen.delete(key);
  return NextResponse.json({ count: seen.size });
}
