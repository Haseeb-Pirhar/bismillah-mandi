require("dotenv").config();

const PROJECT_NAME = process.env.PROJECT_NAME || "proj";
const MODE = process.env.MODE || "stag";
const PORT = process.env.PORT || 3002;

module.exports = {
  apps: [
    {
      name: `${PROJECT_NAME}-${MODE}`,
      script: "./dist/index.js",
      interpreter: "node",
      interpreter_args: "-r ./register-aliases.js",
      env: {
        PORT,
      },
      autorestart: true,
      error_file: "./logs/pm2/error.log",
      out_file: "./logs/pm2/out.log",
      log_file: "./logs/pm2/combined.log",
      time: true,
    },
    {
      name: `${PROJECT_NAME}-${MODE}-cronjob`,
      script: "./scripts/cronjob.sh",
      cron_restart: "*/10 * * * *",
      autorestart: false,
    },
    {
      name: `${PROJECT_NAME}-${MODE}-backup`,
      script: "yarn",
      args: "script mongodb-backup",
      cron_restart: "0 0 * * *",
      autorestart: false,
      error_file: "./logs/pm2/backup-error.log",
      out_file: "./logs/pm2/backup-out.log",
      log_file: "./logs/pm2/backup-combined.log",
      time: true,
      env: {
        PM2_HOME: process.env.PM2_HOME || process.env.HOME + "/.pm2",
      },
    },
  ],
  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy": "yarn install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
