const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Go up one level from scripts/ to project root
const projectRoot = path.join(__dirname, '..');
const inputImage = path.join(projectRoot, 'public', 'alsala-icon.png');
const outputDir = path.join(projectRoot, 'public');

// Icon sizes needed for PWA
const icons = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 192, name: 'icon-192x192-maskable.png', maskable: true },
  { size: 512, name: 'icon-512x512-maskable.png', maskable: true },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon.ico' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

async function generateIcons() {
  try {
    // Check if input image exists
    if (!fs.existsSync(inputImage)) {
      console.error('Error: alsala-icon.png not found in public folder');
      process.exit(1);
    }

    console.log('Generating PWA icons...');

    for (const icon of icons) {
      const outputPath = path.join(outputDir, icon.name);
      
      let transform = sharp(inputImage)
        .resize(icon.size, icon.size, {
          fit: 'cover',
          position: 'center'
        });

      // For maskable icons, add padding
      if (icon.maskable) {
        const padding = Math.round(icon.size * 0.1); // 10% padding
        const newSize = icon.size - (padding * 2);
        transform = sharp(inputImage)
          .resize(newSize, newSize, {
            fit: 'cover',
            position: 'center'
          })
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a
          });
      }

      if (icon.name.endsWith('.ico')) {
        // For favicon.ico, we need to use a different approach
        await transform.toFormat('png').toFile(outputPath.replace('.ico', '.png'));
        console.log(`✓ Generated ${icon.name.replace('.ico', '.png')}`);
      } else {
        await transform.toFormat('png').toFile(outputPath);
        console.log(`✓ Generated ${icon.name}`);
      }
    }

    // Generate mask-icon.svg (for Safari pinned tab)
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#0f172a"/>
      <text x="50" y="70" font-size="60" text-anchor="middle" fill="#38bdf8">🕌</text>
    </svg>`;
    fs.writeFileSync(path.join(outputDir, 'mask-icon.svg'), svgContent);
    console.log('✓ Generated mask-icon.svg');

    console.log('\n✅ All PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
