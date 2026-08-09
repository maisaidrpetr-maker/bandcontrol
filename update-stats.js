import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outputPath = path.resolve('src/data/stats.json');

let fileCount = '—';
let commitInfo = { hash: '—', message: '—', date: '—' };
let totalChanges = '30'; // fallback

// 1. Zkusíme načíst stará data, kdybychom byli v prostředí bez plné git historie (Vercel)
try {
  if (fs.existsSync(outputPath)) {
    const oldData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    if (oldData.totalChanges) totalChanges = oldData.totalChanges;
  }
} catch (e) {}

// 2. Počet souborů
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

// 4. Celkový počet změn – spočítáme z Gitu POUZE pokud to zafunguje (na localhostu)
try {
  const count = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
  if (count) {
    totalChanges = count; // Tady se na localhostu samo vezme reálné číslo z tvého Gitu
  }
} catch (e) {
  // Na Vercelu git rev-list selže, takže se ignoruje 
  // a zůstane zachované číslo, které přišlo v JSONu z GitHubu
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