import { cpSync, mkdirSync, rmSync } from 'fs';
import { execSync } from 'child_process';

const BUILD_DIRECTORY = 'dist';

console.log('🔧 Running Webflow HTML processor...');
// Run the Webflow HTML processor first
execSync('node src/index.js', { stdio: 'inherit' });

// Clean and create dist directory (if not already created by processor)
if (!BUILD_DIRECTORY.startsWith('dist')) {
  rmSync(BUILD_DIRECTORY, { recursive: true, force: true });
  mkdirSync(BUILD_DIRECTORY, { recursive: true });
}

// Copy js and css folders to dist (if they're not already there)
try {
  cpSync('js', `${BUILD_DIRECTORY}/js`, { recursive: true });
  console.log('✅ Copied js folder to dist/');
} catch (e) {
  console.log('ℹ️ js folder already in dist or not found');
}

try {
  cpSync('css', `${BUILD_DIRECTORY}/css`, { recursive: true });
  console.log('✅ Copied css folder to dist/');
} catch (e) {
  console.log('ℹ️ css folder already in dist or not found');
}

console.log('✅ Build complete! Ready for deployment.');