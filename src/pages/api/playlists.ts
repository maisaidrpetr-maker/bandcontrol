export const prerender = false;
import type { APIRoute } from 'astro';
import { createClient } from 'redis';

// Zde musíme explicitně předat url z proměnných prostředí
const redis = createClient({
  url: import.meta.env.REDIS_URL
});

redis.on('error', (err) => console.error('Redis Client Error', err));

await redis.connect();

export const GET: APIRoute = async () => {
  try {
    const data = await redis.get('bandcontrol:playlists');
    const playlists = data ? JSON.parse(data) : [];
    
    return new Response(JSON.stringify(playlists), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch playlists' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    await redis.set('bandcontrol:playlists', JSON.stringify(body));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save playlists' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};