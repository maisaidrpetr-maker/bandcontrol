import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { createClient } from 'redis';

async function updateStats() {
  let totalChanges = 85; // Výchozí hodnota pro jistotu

  // Zkusíme se připojit k Redis, jenom pokud je REDIS_URL k dispozici
  if (process.env.REDIS_URL) {
    const client = createClient({
      url: process.env.REDIS_URL
    });

    try {
      await client.connect();
      let currentVal = await client.get('build_counter');
      
      if (!currentVal || parseInt(currentVal) < 85) {
        await client.set('build_counter', 85);
        totalChanges = 85;
      } else {
        totalChanges = await client.incr('build_counter');
      }

      await client.quit();
    } catch (e) {
      console.error('Chyba při komunikaci s Redisem:', e);
    }
  }

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

  const targetPath = path.resolve('public/stats.json');
  fs.writeFileSync(targetPath, JSON.stringify(stats, null, 2));
  console.log('Statistiky úspěšně aktualizovány:', stats);
}

updateStats();