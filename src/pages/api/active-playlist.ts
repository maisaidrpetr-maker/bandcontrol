import type { APIRoute } from 'astro';
import { createClient } from 'redis';

export const prerender = false;

const client = createClient({
  url: import.meta.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect().catch(() => {});

export const GET: APIRoute = async () => {
  try {
    const activeId = await client.get('active_playlist');
    return new Response(JSON.stringify({ activeId }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Chyba při načítání' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const activeId = body.activeId;
    
    if (!activeId) {
      return new Response(JSON.stringify({ error: 'Chybí activeId' }), { status: 400 });
    }

    await client.set('active_playlist', activeId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Chyba při ukládání' }), { status: 500 });
  }
};