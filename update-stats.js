import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outputPath = path.resolve('src/data/stats.json');

let fileCount = '83';
let commitInfo = { hash: '370902c', message: 'UpdateCommitCount', date: '2026-08-09 05:35:00 +0200' };

// Zde máme číslo natvrdo, takže Vercel už se nemá odkud dozvědět o třicítce
let totalChanges = '70'; 

try {
  const gitFiles = execSync('git ls-files', { encoding: 'utf-8' });
  fileCount = gitFiles.split('\n').filter(Boolean).length.toString();
} catch (e) {}

try {
  const lastCommit = execSync('git log -1 --format="%h|%s|%ai"', { encoding: 'utf-8' }).trim();
  const [hash, message, date] = lastCommit.split('|');
  commitInfo = { hash, message, date };
} catch (e) {}

const stats = {
  fileCount,
  commitInfo,
  totalChanges,
  updatedAt: new Date().toISOString()
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));

console.log('Stats updated successfully:', stats);