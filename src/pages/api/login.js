import { Redis } from '@upstash/redis';
import { USERS } from '../../data/users.js';

const redis = Redis.fromEnv();

export async function POST({ request, clientAddress }) {
  try {
    const { password } = await request.json();
    const cleanPassword = (password || '').trim().toLowerCase();
    const userValue = USERS[cleanPassword];

    if (!userValue) {
      return new Response(JSON.stringify({ success: false, error: 'Špatné heslo' }), { status: 401 });
    }

    const namePart = userValue.split('(')[0].trim();
    const rolePart = userValue.split('(')[1]?.replace(')', '').trim() || 'Člen';

    // Zápis do Redisu
    try {
      const logEntry = JSON.stringify({
        time: new Date().toISOString(),
        user: namePart,
        role: rolePart,
        ip: clientAddress || request.headers.get('x-forwarded-for') || 'neznámá IP'
      });
      await redis.lpush('login_logs', logEntry);
      await redis.ltrim('login_logs', 0, 99); // Necháme posledních 100 záznamů
    } catch (redisError) {
      console.error('Chyba zápisu do Redisu:', redisError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      name: namePart, 
      role: rolePart 
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), { status: 500 });
  }
}