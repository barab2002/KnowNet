const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting NestJS API in development mode with hot-reload...\n');

const child = spawn(
  'npx',
  [
    'nodemon',
    '--watch', 'api/src',
    '--ext', 'ts',
    '--exec', 'node --require @swc-node/register api/src/main.ts'
  ],
  {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
  }
);

child.on('error', (error) => {
  console.error('❌ Failed to start:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\n❌ Process exited with code ${code}`);
    process.exit(code);
  }
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit(0);
});

