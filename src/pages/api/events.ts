export const prerender = false;
import type { APIRoute } from 'astro';
import { createClient } from 'redis';

const redis = createClient({
  url: import.meta.env.REDIS_URL
});

redis.on('error', (err) => console.error('Redis Client Error', err));

await redis.connect();

export const GET: APIRoute = async () => {
  try {
    const data = await redis.get('bandcontrol:events');
    const events = data ? JSON.parse(data) : [];
    
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    await redis.set('bandcontrol:events', JSON.stringify(body));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};