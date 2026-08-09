import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  let totalChanges = '0';
  let fileCount = '0';
  let commitHash = '';
  let commitMessage = '';
  let commitDate = '';

  try {
    totalChanges = execSync('git rev-list --all --count').toString().trim();
  } catch (err) {
    try {
      totalChanges = execSync('git rev-list --count HEAD').toString().trim();
    } catch (e) {}
  }

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

  const targetPath = path.resolve('public/stats.json');
  fs.writeFileSync(targetPath, JSON.stringify(stats, null, 2));
  console.log('Statistiky úspěšně aktualizovány:', stats);
} catch (e) {
  console.error('Chyba generování stats:', e);
}