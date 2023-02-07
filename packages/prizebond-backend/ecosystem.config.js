module.exports = {
  apps: [
    {
      name: "prizebond-backend",
      script: "./index.js",
      instances: 1,
      exec_mode: "cluster",
      watch: true,
      env: {
        NODE_ENV: "development",
        PORT: "3333",
      },
    },
  ],
};
