import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

let fileCount = '—';
let commitInfo = { hash: '—', message: '—', date: '—' };
let totalChanges = '—';

try {
  // Počet souborů z gitu
  const gitFiles = execSync('git ls-files', { encoding: 'utf-8' });
  fileCount = gitFiles.split('\n').filter(Boolean).length.toString();
} catch (e) {}

try {
  // Poslední commit (hash, zpráva, datum)
  const lastCommit = execSync('git log -1 --format="%h|%s|%ai"', { encoding: 'utf-8' }).trim();
  const [hash, message, date] = lastCommit.split('|');
  commitInfo = { hash, message, date };
} catch (e) {}

try {
  // Celkový počet commitů / změn
  const count = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
  totalChanges = count;
} catch (e) {}

const stats = {
  fileCount,
  commitInfo,
  totalChanges,
  updatedAt: new Date().toISOString()
};

// Uloží to do JSON souboru ve složce projektu (např. src/data/stats.json)
const outputPath = path.resolve('src/data/stats.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));

console.log('Stats updated successfully:', stats);