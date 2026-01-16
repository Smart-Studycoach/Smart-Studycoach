module.exports = {
  apps: [
    {
      name: 'smartstudycoach-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 8080
      }
    }
  ]
};
