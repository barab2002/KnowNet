const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

// Load .env file
const envFile = join(__dirname, '.env.production');
const envVars = {};
if (existsSync(envFile)) {
  readFileSync(envFile, 'utf-8').split('\n').forEach((line) => {
    const [key, ...vals] = line.split('=');
    if (key && !key.startsWith('#') && vals.length) {
      envVars[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

module.exports = {
  apps: [
    {
      name: 'knownet-api',
      script: 'dist/api/main.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ...envVars,
      },
      uid: 'barab',
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      merge_logs: true,
    },
    {
      name: 'knownet-client',
      script: 'npx',
      args: 'serve dist/client -s -l 4200',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
      uid: 'barab',
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/client-error.log',
      out_file: 'logs/client-out.log',
      merge_logs: true,
    },
  ],
};
