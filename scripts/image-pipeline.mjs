import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'lovable-uploads');

const VALID_EXT = new Set(['.png', '.jpg', '.jpeg']);

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true }).catch(() => {});
}

async function convertOne(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!VALID_EXT.has(ext)) return false;

  const base = filePath.slice(0, -ext.length);
  const outWebp = `${base}.webp`;
  const outAvif = `${base}.avif`;

  const srcStat = await fs.promises.stat(filePath).catch(() => null);
  if (!srcStat) return false;

  // Skip if outputs exist and are newer
  const webpStat = await fs.promises.stat(outWebp).catch(() => null);
  const avifStat = await fs.promises.stat(outAvif).catch(() => null);
  const srcMtime = srcStat.mtimeMs;
  const needWebp = !webpStat || webpStat.mtimeMs < srcMtime;
  const needAvif = !avifStat || avifStat.mtimeMs < srcMtime;

  try {
    const img = sharp(filePath);
    if (needWebp) {
      await img.clone().webp({ quality: 78 }).toFile(outWebp);
      console.log('✓ webp', path.relative(ROOT, outWebp));
    }
    if (needAvif) {
      await img.clone().avif({ quality: 45 }).toFile(outAvif);
      console.log('✓ avif', path.relative(ROOT, outAvif));
    }
    return true;
  } catch (e) {
    console.warn('! convert failed', filePath, e?.message);
    return false;
  }
}

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const res = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(res);
    else await convertOne(res);
  }
}

async function main() {
  const argDir = process.argv[2];
  const targetDir = argDir ? path.resolve(ROOT, argDir) : UPLOADS_DIR;
  await ensureDir(targetDir);
  console.log('Image pipeline start:', path.relative(ROOT, targetDir));
  await walk(targetDir);
  console.log('Image pipeline done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
