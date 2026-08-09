import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

// Inicializace Redisu (Vercel si klíče automaticky vezme z proměnných prostředí)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function updateStats() {
  let totalChanges = 1;

  try {
    // Zkusíme v Redisu inkrementovat klíč 'build_counter'
    totalChanges = await redis.incr('build_counter');
  } catch (e) {
    console.error('Chyba při komunikaci s Redisem, používám záložní hodnotu:', e);
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