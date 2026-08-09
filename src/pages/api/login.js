import { USERS } from '../../data/users.js';

export async function POST({ request }) {
  try {
    const { password } = await request.json();
    const cleanPassword = (password || '').trim().toLowerCase();
    const userValue = USERS[cleanPassword];

    if (!userValue) {
      return new Response(JSON.stringify({ success: false, error: 'Špatné heslo' }), { status: 401 });
    }

    const namePart = userValue.split('(')[0].trim();
    const rolePart = userValue.split('(')[1]?.replace(')', '').trim() || 'Člen';

    return new Response(JSON.stringify({ 
      success: true, 
      name: namePart, 
      role: rolePart 
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), { status: 500 });
  }
}