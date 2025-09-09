module.exports = {
  apps: [
    {
      name: 'library-backend',
      script: './backend/index.js',
      cwd: '/root/library/library-app',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_NAME: 'librarydb',
        DB_USER: 'libraryuser',
        DB_PASSWORD: 'Ubizor21!'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/library-backend-error.log',
      out_file: '/var/log/pm2/library-backend-out.log',
      log_file: '/var/log/pm2/library-backend-combined.log'
    },
    {
      name: 'library-frontend',
      script: 'serve',
      args: ['-s', './build', '-l', '3000'],
      cwd: '/root/library/library-app',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/library-frontend-error.log',
      out_file: '/var/log/pm2/library-frontend-out.log',
      log_file: '/var/log/pm2/library-frontend-combined.log'
    }
  ]
};
