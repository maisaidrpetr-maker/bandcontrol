import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

// Cesta k JSON souboru na disku
const dataFilePath = path.resolve('src/data/events.json');

// Pomocná funkce pro načtení dat
function getStoredEvents() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error('Chyba při čtení souboru s událostmi:', err);
  }
  return [];
}

export const GET: APIRoute = async () => {
  const events = getStoredEvents();
  return new Response(JSON.stringify(events), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Zajistíme, že složka src/data existuje
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Zápis dat do JSON souboru
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Chyba při ukládání událostí' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};