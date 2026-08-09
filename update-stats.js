import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  const targetPath = path.resolve('public/stats.json');
  
  // Načteme staré hodnoty, abychom věděli aktuální stav counteru
  let currentCount = 0;
  if (fs.existsSync(targetPath)) {
    try {
      const oldData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      currentCount = parseInt(oldData.totalChanges, 10) || 0;
    } catch (e) {}
  }

  // Při každém buildu/syncu přičteme 1
  const totalChanges = currentCount + 1;

  let fileCount = '0';
  let commitHash = '';
  let commitMessage = '';
  let commitDate = '';

  try {
    fileCount = execSync('git ls-files | wc -l').toString().trim();
  } catch (e) {}

  try {
    commitHash = execSync('git log -1 --format="%h"').toString().trim();
    commitMessage = execSync('git log -1 --format="%s"').toString().trim();
    commitDate = execSync('git log -1 --format="%ad"').toString().trim();
  } catch (e) {}

  const stats = {
    totalChanges,
    fileCount,
    commitInfo: { hash: commitHash, message: commitMessage, date: commitDate }
  };

  fs.writeFileSync(targetPath, JSON.stringify(stats, null, 2));
  console.log('Statistiky úspěšně aktualizovány:', stats);
} catch (e) {
  console.error('Chyba generování stats:', e);
}