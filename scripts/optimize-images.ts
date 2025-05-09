/**
 * Script untuk mengoptimasi gambar dalam direktori public/images
 * 
 * Cara penggunaan:
 * 1. Jalankan: npm run optimize-images
 * 2. Atau: npm run optimize-images -- --format=webp --quality=70
 */

import { optimizeImagesInDirectory } from '../src/utils/imageOptimizer';
import path from 'path';

async function main() {
  // Parse argumen command line
  const args = process.argv.slice(2);
  const options: {
    inputDir?: string;
    outputDir?: string;
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
    recursive?: boolean;
  } = {
    inputDir: 'public/images',
    outputDir: 'public/images/optimized',
    recursive: true,
  };

  // Parse argumen command line
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      if (key && value) {
        switch (key) {
          case 'inputDir':
            options.inputDir = value;
            break;
          case 'outputDir':
            options.outputDir = value;
            break;
          case 'width':
            options.width = parseInt(value, 10);
            break;
          case 'height':
            options.height = parseInt(value, 10);
            break;
          case 'quality':
            options.quality = parseInt(value, 10);
            break;
          case 'format':
            if (['jpeg', 'png', 'webp', 'avif'].includes(value)) {
              options.format = value as any;
            }
            break;
          case 'recursive':
            options.recursive = value === 'true';
            break;
        }
      }
    }
  }

  console.log(`Optimizing images from ${options.inputDir} to ${options.outputDir}`);
  console.log('Options:', options);

  try {
    const results = await optimizeImagesInDirectory(
      options.inputDir!,
      options.outputDir!,
      {
        width: options.width,
        height: options.height,
        quality: options.quality,
        format: options.format,
        recursive: options.recursive,
      }
    );

    console.log(`Processed ${results.length} files`);
    
    // Hitung statistik
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    console.log(`Successfully optimized: ${successCount} files`);
    if (failCount > 0) {
      console.log(`Failed to optimize: ${failCount} files`);
    }

    // Tampilkan daftar file yang berhasil dioptimasi
    if (successCount > 0) {
      console.log('\nOptimized files:');
      results
        .filter(r => r.success)
        .forEach(r => {
          console.log(`- ${r.file} -> ${r.outputPath}`);
        });
    }

    // Tampilkan daftar file yang gagal dioptimasi
    if (failCount > 0) {
      console.log('\nFailed files:');
      results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`- ${r.file}: ${r.error}`);
        });
    }
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

main().catch(console.error); 