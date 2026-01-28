#!/usr/bin/env node

/**
 * Script to build and run the KnowNet API backend
 * This bypasses the Nx daemon to avoid serialization issues
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🔨 Building the API...\n');

// Build the API
const build = spawn('npx', ['cross-env', 'NX_DAEMON=false', 'nx', 'build', 'api'], {
  cwd: path.resolve(__dirname, '..'),
  shell: true,
  stdio: 'inherit'
});

build.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Build failed with exit code ${code}`);
    process.exit(code);
  }

  console.log('\n✅ Build successful! Starting the server...\n');

  // Run the built application
  const server = spawn('node', ['dist/api/main.js'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit'
  });

  server.on('close', (serverCode) => {
    console.log(`\n🛑 Server stopped with exit code ${serverCode}`);
    process.exit(serverCode);
  });
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});
