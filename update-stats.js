import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outputPath = path.resolve('src/data/stats.json');

let fileCount = '—';
let commitInfo = { hash: '—', message: '—', date: '—' };
let totalChanges = '30'; // výchozí

// 1. Zkusíme načíst dosavadní hodnoty ze souboru
try {
  if (fs.existsSync(outputPath)) {
    const oldData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    if (oldData.totalChanges) totalChanges = oldData.totalChanges;
  }
} catch (e) {}

// 2. Počet souborů z Gitu
try {
  const gitFiles = execSync('git ls-files', { encoding: 'utf-8' });
  fileCount = gitFiles.split('\n').filter(Boolean).length.toString();
} catch (e) {}

// 3. Poslední commit
try {
  const lastCommit = execSync('git log -1 --format="%h|%s|%ai"', { encoding: 'utf-8' }).trim();
  const [hash, message, date] = lastCommit.split('|');
  commitInfo = { hash, message, date };
} catch (e) {}

// 4. Počet změn: ZJIŠŤUJEME JEN LOKÁLNĚ! 
// Pokud běží build na Vercelu (existuje proměnná VERCEL nebo procesor není plný lokální git), 
// tak počítání z Gitu zcela přeskočíme a vezmeme to, co přišlo ze souboru.
const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  try {
    const count = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
    if (count) {
      totalChanges = count; // Doma na localhostu se spočítá reálná hodnota
    }
  } catch (e) {}
}

const stats = {
  fileCount,
  commitInfo,
  totalChanges,
  updatedAt: new Date().toISOString()
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));

console.log('Stats updated successfully:', stats);