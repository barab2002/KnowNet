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
      },
      // Load .env file variables
      env_file: '.env',
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
