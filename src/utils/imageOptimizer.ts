/**
 * Utility untuk mengoptimasi gambar menggunakan Sharp
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

interface OptimizeResult {
  success: boolean;
  outputPath?: string;
  error?: any;
  file?: string;
}

/**
 * Mengubah ukuran dan mengoptimasi gambar
 * @param inputPath Path gambar input
 * @param outputPath Path gambar output
 * @param options Opsi untuk optimasi gambar
 */
export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
  } = {}
): Promise<OptimizeResult> {
  try {
    // Buat direktori output jika belum ada
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Setup sharp dengan opsi yang diberikan
    let sharpInstance = sharp(inputPath);

    // Resize jika width atau height diberikan
    if (options.width || options.height) {
      sharpInstance = sharpInstance.resize({
        width: options.width,
        height: options.height,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Set format output
    switch (options.format) {
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: options.quality || 80 });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: options.quality || 80 });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: options.quality || 80 });
        break;
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality: options.quality || 80 });
        break;
      default:
        // Pertahankan format asli dengan kualitas yang diberikan
        const ext = path.extname(inputPath).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg') {
          sharpInstance = sharpInstance.jpeg({ quality: options.quality || 80 });
        } else if (ext === '.png') {
          sharpInstance = sharpInstance.png({ quality: options.quality || 80 });
        } else if (ext === '.webp') {
          sharpInstance = sharpInstance.webp({ quality: options.quality || 80 });
        } else if (ext === '.avif') {
          sharpInstance = sharpInstance.avif({ quality: options.quality || 80 });
        }
    }

    // Simpan gambar yang dioptimasi
    await sharpInstance.toFile(outputPath);
    return { success: true, outputPath };
  } catch (error) {
    console.error('Error optimizing image:', error);
    return { success: false, error };
  }
}

/**
 * Batch mengoptimasi semua gambar dalam direktori
 * @param inputDir Direktori input
 * @param outputDir Direktori output
 * @param options Opsi untuk optimasi
 */
export async function optimizeImagesInDirectory(
  inputDir: string,
  outputDir: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
    recursive?: boolean;
  } = {}
): Promise<OptimizeResult[]> {
  try {
    // Buat direktori output jika belum ada
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(inputDir);
    const results: OptimizeResult[] = [];

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const stats = fs.statSync(inputPath);

      if (stats.isDirectory() && options.recursive) {
        // Jika direktori dan recursive = true, proses secara rekursif
        const subOutputDir = path.join(outputDir, file);
        const subResults: OptimizeResult[] = await optimizeImagesInDirectory(
          inputPath,
          subOutputDir,
          options
        );
        results.push(...subResults);
      } else if (stats.isFile()) {
        // Cek apakah file adalah gambar
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'].includes(ext)) {
          // Tentukan format output
          let outputFormat = options.format;
          let outputExt = ext;

          if (outputFormat) {
            outputExt = `.${outputFormat}`;
          }

          // Ganti ekstensi file jika format output ditentukan
          const outputFile = path.basename(file, ext) + outputExt;
          const outputPath = path.join(outputDir, outputFile);

          // Optimasi gambar
          const result = await optimizeImage(inputPath, outputPath, options);
          results.push({ file, ...result });
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Error optimizing images in directory:', error);
    return [{ success: false, error }];
  }
}

export default {
  optimizeImage,
  optimizeImagesInDirectory,
}; 