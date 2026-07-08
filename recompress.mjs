// One-off: recompress all word pictures and icons with palette PNG.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

let before = 0, after = 0;
for (const dir of ['public/assets/images', 'public/assets/icons']) {
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.png'))) {
    const file = path.join(dir, f);
    const orig = fs.statSync(file).size;
    const buf = await sharp(file)
      .png({ palette: true, quality: 92, compressionLevel: 9, effort: 10 })
      .toBuffer();
    before += orig;
    if (buf.length < orig) {
      fs.writeFileSync(file, buf);
      after += buf.length;
    } else {
      after += orig;
    }
    console.log(`${f}: ${(orig / 1024).toFixed(0)} -> ${(Math.min(buf.length, orig) / 1024).toFixed(0)} KB`);
  }
}
console.log(`TOTAL: ${(before / 1024 / 1024).toFixed(1)} -> ${(after / 1024 / 1024).toFixed(1)} MB`);
