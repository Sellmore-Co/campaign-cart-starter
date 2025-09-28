import { cpSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const BUILD_DIRECTORY = 'dist-cloudflare';
const STATIC_DIR = 'src/static';

console.log('🚀 Building for Cloudflare Workers (static files only)...');

// Clean and create build directory
rmSync(BUILD_DIRECTORY, { recursive: true, force: true });
mkdirSync(BUILD_DIRECTORY, { recursive: true });

// Create css and js directories
mkdirSync(join(BUILD_DIRECTORY, 'css'), { recursive: true });
mkdirSync(join(BUILD_DIRECTORY, 'js'), { recursive: true });

// Copy CSS files from static
const cssFiles = [
  'custom.css',
  'components.css',
  'olympus-mv.css'
];

cssFiles.forEach(file => {
  const sourcePath = join(STATIC_DIR, file);
  const destPath = join(BUILD_DIRECTORY, 'css', file);

  if (existsSync(sourcePath)) {
    cpSync(sourcePath, destPath);
    console.log(`✅ Copied css/${file}`);
  } else {
    console.log(`⚠️ File not found: ${sourcePath}`);
  }
});

// Copy JS files from static
const jsFiles = [
  'config.js',
  'loader.js',
  'olympus-mv-full.js',
  'olympus-mv-selection.js'
];

jsFiles.forEach(file => {
  const sourcePath = join(STATIC_DIR, file);
  const destPath = join(BUILD_DIRECTORY, 'js', file);

  if (existsSync(sourcePath)) {
    cpSync(sourcePath, destPath);
    console.log(`✅ Copied js/${file}`);
  } else {
    console.log(`⚠️ File not found: ${sourcePath}`);
  }
});

// Copy config.js to root as well (if needed by your app)
const configSource = join(STATIC_DIR, 'config.js');
const configDest = join(BUILD_DIRECTORY, 'config.js');
if (existsSync(configSource)) {
  cpSync(configSource, configDest);
  console.log('✅ Copied config.js to root');
}

console.log(`\n✅ Cloudflare build complete! Static files ready in ${BUILD_DIRECTORY}/`);