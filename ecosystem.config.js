module.exports = {
  apps: [
    {
      name: "indigo-api",
      cwd: "./apps/api",
      script: "dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      max_memory_restart: "500M",
      error_file: "./logs/api-err.log",
      out_file: "./logs/api-out.log",
      time: true,
    },
    {
      name: "indigo-web",
      cwd: "./apps/web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "750M",
      error_file: "./logs/web-err.log",
      out_file: "./logs/web-out.log",
      time: true,
    },
    {
      name: "indigo-admin",
      cwd: "./apps/admin",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      max_memory_restart: "500M",
      error_file: "./logs/admin-err.log",
      out_file: "./logs/admin-out.log",
      time: true,
    },
  ],
};
