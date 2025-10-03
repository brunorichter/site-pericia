module.exports = {
  apps: [
    {
      name: "pericia",
      cwd: "/home/richter/www",  // ajuste para o caminho real no servidor
      script: "./node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 21092",
      env: {
        NODE_ENV: "production",
        PORT: "21092",
        HOST: "0.0.0.0"
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "/home/richter/logs/pericia.err.log",
      out_file: "/home/richter/logs/pericia.out.log",
      time: true
    }
  ]
}