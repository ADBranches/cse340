// utilities/image.js
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const OUT_IMG_DIR = "public/uploads/images";
const OUT_THM_DIR = "public/uploads/thumbs";

// ensure output dirs exist
await fs.mkdir(OUT_IMG_DIR, { recursive: true });
await fs.mkdir(OUT_THM_DIR, { recursive: true });

/**
 * Process an uploaded image:
 *  - optimize main image (max 1600px wide)
 *  - generate thumbnail (400px wide)
 * Returns { imagePath, thumbPath } relative to /public
 */
export async function processVehicleImages(tmpFilePath, baseNameNoExt) {
  const imageName = `${baseNameNoExt}.webp`;
  const thumbName = `${baseNameNoExt}_thumb.webp`;

  const imageOut = path.join(OUT_IMG_DIR, imageName);
  const thumbOut = path.join(OUT_THM_DIR, thumbName);

  // main optimized image
  await sharp(tmpFilePath)
    .rotate()               // respect EXIF
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(imageOut);

  // thumbnail
  await sharp(tmpFilePath)
    .rotate()
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(thumbOut);

  // clean up temp file
  try { await fs.unlink(tmpFilePath); } catch {}

  // return web-facing paths (what you’ll store in DB)
  return {
    imagePath: `/${imageOut.replace(/^public\//, "")}`,
    thumbPath: `/${thumbOut.replace(/^public\//, "")}`
  };
}
