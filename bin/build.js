import { cpSync, mkdirSync, rmSync } from 'fs';

const BUILD_DIRECTORY = 'dist';

// Clean and create dist directory
rmSync(BUILD_DIRECTORY, { recursive: true, force: true });
mkdirSync(BUILD_DIRECTORY, { recursive: true });

// Copy js and css folders to dist
cpSync('js', `${BUILD_DIRECTORY}/js`, { recursive: true });
cpSync('css', `${BUILD_DIRECTORY}/css`, { recursive: true });

console.log('✅ Copied js and css folders to dist/');