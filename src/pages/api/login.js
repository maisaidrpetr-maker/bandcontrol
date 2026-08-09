export async function POST({ request }) {
  try {
    const data = await request.json();
    const password = (data.password || '').trim();

    // Tady si uprav své heslo a jméno, které chceš používat
    // Příklad: heslo "tajne" -> přihlásí jako Admin
    const users = {
      "tajneheslo": { name: "Petr", role: "admin" },
      // sem můžeš přidat další hesla, např. "kapela": { name: "Band", role: "člen" }
    };

    const user = users[password];

    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Špatné heslo' }), { status: 401 });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      name: user.name, 
      role: user.role 
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), { status: 500 });
  }
}