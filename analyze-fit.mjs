// Measure how much of the frame each word picture's object occupies.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DIR = 'public/assets/images';
const rows = [];
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.png'))) {
  const { data, info } = await sharp(path.join(DIR, f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  const fill = Math.max(maxX - minX + 1, maxY - minY + 1) / Math.max(w, h);
  rows.push({ f, dim: `${w}x${h}`, fill });
}
rows.sort((a, b) => a.fill - b.fill);
rows.forEach(r => console.log(`${(r.fill * 100).toFixed(0)}%\t${r.dim}\t${r.f}`));
