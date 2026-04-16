import fs from 'fs';
import path from 'path';

const placesDir = './src/content/places';
const files = fs.readdirSync(placesDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(placesDir, file), 'utf8');
  
  content = content
    .replace(/\n?  reporterId: "[^"]*"\n?/g, '\n')
    .replace(/\n?    reporterId: "[^"]*"\n?/g, '\n')
    .replace(/\n?reviews:\n([\s\S]*?)(?=\n---)/g, '\n')
    .replace(/\n    reviews:\n([\s\S]*?)(?=\n    ---)/g, '\n')
    .replace(/reporter: "[^"]*"/, 'reporter: "네이버 유저"')
    .replace(/reporterRegion: "[^"]*"\n  reporterId: "[^"]*"/, 'reporterRegion: "인천"')
    .replace(/\n{3,}/g, '\n\n');
  
  content = content.replace(/---$/m, 'createdAt: "2026-04-16"\n---');
  
  fs.writeFileSync(path.join(placesDir, file), content, 'utf8');
});

console.log('Reset all place files');
