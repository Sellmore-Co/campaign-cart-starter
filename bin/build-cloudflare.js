import { cpSync, mkdirSync, rmSync, existsSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const BUILD_DIRECTORY = 'dist-cloudflare';
const STATIC_DIR = 'src/static';

console.log('🚀 Building for Cloudflare Workers (static files only)...');

// Clean and create build directory
rmSync(BUILD_DIRECTORY, { recursive: true, force: true });
mkdirSync(BUILD_DIRECTORY, { recursive: true });

// Create css and js directories
mkdirSync(join(BUILD_DIRECTORY, 'css'), { recursive: true });
mkdirSync(join(BUILD_DIRECTORY, 'js'), { recursive: true });

// Get all files from static directory
const allFiles = readdirSync(STATIC_DIR);

// Copy all CSS files
const cssFiles = allFiles.filter(file => extname(file) === '.css');
cssFiles.forEach(file => {
  const sourcePath = join(STATIC_DIR, file);
  const destPath = join(BUILD_DIRECTORY, 'css', file);
  cpSync(sourcePath, destPath);
  console.log(`✅ Copied css/${file}`);
});

// Copy all JS files
const jsFiles = allFiles.filter(file => extname(file) === '.js');
jsFiles.forEach(file => {
  const sourcePath = join(STATIC_DIR, file);
  const destPath = join(BUILD_DIRECTORY, 'js', file);
  cpSync(sourcePath, destPath);
  console.log(`✅ Copied js/${file}`);
});

// Copy config.js to root as well (if needed by your app)
const configSource = join(STATIC_DIR, 'config.js');
const configDest = join(BUILD_DIRECTORY, 'config.js');
if (existsSync(configSource)) {
  cpSync(configSource, configDest);
  console.log('✅ Copied config.js to root');
}

console.log(`\n✅ Cloudflare build complete! Static files ready in ${BUILD_DIRECTORY}/`);