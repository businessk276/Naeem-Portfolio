const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'src', 'assets', 'images');
const targetDir = path.join(process.cwd(), 'public', 'uploads');

fs.mkdirSync(targetDir, { recursive: true });
for (const file of fs.readdirSync(sourceDir)) {
  fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
}