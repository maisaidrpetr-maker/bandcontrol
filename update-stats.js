import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  const totalChanges = execSync('git rev-list --all --count').toString().trim();
  const fileCount = execSync('git ls-files | wc -l').toString().trim();
  const commitHash = execSync('git log -1 --format="%h"').toString().trim();
  const commitMessage = execSync('git log -1 --format="%s"').toString().trim();
  const commitDate = execSync('git log -1 --format="%ad"').toString().trim();

  const stats = {
    totalChanges,
    fileCount,
    commitInfo: { hash: commitHash, message: commitMessage, date: commitDate }
  };

  fs.writeFileSync(path.resolve('.public/stats.json'), JSON.stringify(stats, null, 2));
  console.log('Statistiky úspěšně aktualizovány:', stats);
} catch (e) {
  console.error('Chyba generování stats:', e);
}