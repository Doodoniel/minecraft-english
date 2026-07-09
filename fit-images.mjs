// Normalize object size in word pictures: crop to the object's bounding box
// and pad with transparency so the object fills TARGET of the frame.
// Usage: node fit-images.mjs [target] [file1 file2 ...]  (default: all below-threshold files)
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DIR = 'public/assets/images';
const TARGET = 0.8;
const THRESHOLD = 0.7; // only refit files whose object fills less than this
const MAX_SIDE = 512;
const SKIP = new Set(['mushroom.png']); // will be replaced soon

for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.png'))) {
  if (SKIP.has(f)) continue;
  const file = path.join(DIR, f);
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
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
  const bw = maxX - minX + 1, bh = maxY - minY + 1;
  const fill = Math.max(bw, bh) / Math.max(w, h);
  if (fill >= THRESHOLD) continue;

  let side = Math.round(Math.max(bw, bh) / TARGET);
  const left = Math.floor((side - bw) / 2), top = Math.floor((side - bh) / 2);
  let img = sharp(file)
    .extract({ left: minX, top: minY, width: bw, height: bh })
    .extend({
      left, top,
      right: side - bw - left,
      bottom: side - bh - top,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  if (side > MAX_SIDE) img = img.resize(MAX_SIDE, MAX_SIDE);
  const buf = await img.png({ palette: true, quality: 92, compressionLevel: 9, effort: 10 }).toBuffer();
  fs.writeFileSync(file, buf);
  console.log(`${f}: fill ${(fill * 100).toFixed(0)}% -> ${(TARGET * 100).toFixed(0)}%, canvas ${Math.min(side, MAX_SIDE)}px, ${(buf.length / 1024).toFixed(0)} KB`);
}
console.log('done');
