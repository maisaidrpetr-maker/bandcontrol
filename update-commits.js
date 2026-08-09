import { execSync } from 'child_process';
import fs from 'fs';

try {
  const gitLog = execSync('git log --pretty=format:"%h|%an|%ad|%s" --date=short', { encoding: 'utf-8' });
  const commits = gitLog.split('\n').filter(Boolean).map(line => {
    const [hash, author, date, message] = line.split('|');
    return { hash, author, date, message };
  });
  fs.writeFileSync('src/data/all-commits.json', JSON.stringify(commits, null, 2));
  console.log(`[build] Úspěšně vygenerováno ${commits.length} commitů do all-commits.json`);
} catch (e) {
  console.log('[build] Git log se nepodařilo vygenerovat, přeskakuji.');
}