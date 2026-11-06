import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.resolve(projectRoot, 'src', 'assets');
const brochureDir = path.resolve(assetsDir, 'brochure');

const isLogoOrIcon = (filename) => {
  const lower = filename.toLowerCase();
  return lower.startsWith('logo') || 
         lower.startsWith('turnkey-logo') || 
         lower.startsWith('icon-') ||
         lower === 'favicon.ico';
};

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let totalOrigBytes = 0;
  let totalNewWebpBytes = 0;
  let totalOptimizedPngBytes = 0;

  console.log(`\n==================================================`);
  console.log(`Processing directory: ${path.relative(projectRoot, dir)}`);
  console.log(`==================================================\n`);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) continue;
    if (!file.match(/\.(png|jpe?g)$/i)) continue;

    const origSize = stat.size;
    totalOrigBytes += origSize;
    const isLogo = isLogoOrIcon(file);
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);

    if (isLogo) {
      // Lossless compression for logos/icons to preserve crisp edges and alpha
      const tmpOut = path.join(dir, `${file}.tmp`);
      await sharp(fullPath)
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(tmpOut);
      const newStat = fs.statSync(tmpOut);
      fs.unlinkSync(fullPath);
      fs.renameSync(tmpOut, fullPath);
      totalOptimizedPngBytes += newStat.size;
      console.log(`[LOGO/ICON] ${file}: ${(origSize / 1024).toFixed(1)} KB -> ${(newStat.size / 1024).toFixed(1)} KB`);
      continue;
    }

    // Photographic assets:
    // 1. Generate WebP with quality 85 and maximum effort (effort: 6)
    const webpPath = path.join(dir, `${baseName}.webp`);
    await sharp(fullPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    const webpStat = fs.statSync(webpPath);
    totalNewWebpBytes += webpStat.size;

    // 2. Also compress the PNG in-place (palette: true, quality: 82) so non-WebP fallbacks are also small
    const tmpPng = path.join(dir, `${file}.tmp`);
    await sharp(fullPath)
      .png({ quality: 82, compressionLevel: 9, palette: true })
      .toFile(tmpPng);
    const pngStat = fs.statSync(tmpPng);
    fs.unlinkSync(fullPath);
    fs.renameSync(tmpPng, fullPath);
    totalOptimizedPngBytes += pngStat.size;

    const webpReduction = ((1 - webpStat.size / origSize) * 100).toFixed(1);
    const pngReduction = ((1 - pngStat.size / origSize) * 100).toFixed(1);

    console.log(`[PHOTO] ${file}:`);
    console.log(`   Original:       ${(origSize / 1024 / 1024).toFixed(2)} MB (${origSize} bytes)`);
    console.log(`   -> WebP:        ${(webpStat.size / 1024).toFixed(1)} KB (${webpReduction}% reduction)`);
    console.log(`   -> Optim. PNG:  ${(pngStat.size / 1024).toFixed(1)} KB (${pngReduction}% reduction)`);
  }

  return { totalOrigBytes, totalNewWebpBytes, totalOptimizedPngBytes };
}

async function run() {
  const r1 = await processDirectory(assetsDir);
  const r2 = await processDirectory(brochureDir);

  const grandOrig = r1.totalOrigBytes + r2.totalOrigBytes;
  const grandWebp = r1.totalNewWebpBytes + r2.totalNewWebpBytes;
  const grandPng = r1.totalOptimizedPngBytes + r2.totalOptimizedPngBytes;

  console.log(`\n==================================================`);
  console.log(`GRAND TOTAL SUMMARY`);
  console.log(`==================================================`);
  console.log(`Original total size:   ${(grandOrig / 1024 / 1024).toFixed(2)} MB`);
  console.log(`New WebP total size:   ${(grandWebp / 1024 / 1024).toFixed(2)} MB (-${((1 - grandWebp / grandOrig) * 100).toFixed(1)}%)`);
  console.log(`Optimized PNG total:   ${(grandPng / 1024 / 1024).toFixed(2)} MB (-${((1 - grandPng / grandOrig) * 100).toFixed(1)}%)`);
  console.log(`==================================================\n`);
}

run().catch(console.error);

