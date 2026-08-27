export const prerender = false;
import type { APIRoute } from 'astro';
import { createClient } from 'redis';

const redis = createClient({
  url: import.meta.env.REDIS_URL
});

redis.on('error', (err) => console.error('Redis Client Error', err));

if (!redis.isOpen) {
  await redis.connect();
}

// Pomocná funkce pro čtení neaktivních skladeb z Redisu
export async function getInactiveSongs(): Promise<string[]> {
  try {
    if (!redis.isOpen) await redis.connect();
    const data = await redis.get('bandcontrol:inactive-songs');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export const GET: APIRoute = async () => {
  try {
    const inactive = await getInactiveSongs();
    return new Response(JSON.stringify(inactive), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch inactive songs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { songId, action } = await request.json();
    if (!songId) {
      return new Response(JSON.stringify({ error: 'Missing songId' }), { status: 400 });
    }

    let inactive = await getInactiveSongs();

    if (action === 'deactivate') {
      if (!inactive.includes(songId)) {
        inactive.push(songId);
      }
    } else if (action === 'activate') {
      inactive = inactive.filter((id) => id !== songId);
    }

    if (!redis.isOpen) await redis.connect();
    await redis.set('bandcontrol:inactive-songs', JSON.stringify(inactive));

    return new Response(JSON.stringify({ success: true, inactive }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};