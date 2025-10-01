module.exports = {
  apps: [
    {
      name: "pericia",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: "21092",
        HOST: "0.0.0.0"
      },
      cwd: "/home/richter/www",  // ajuste para o caminho real no servidor
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "/home/richter/logs/pericia.err.log",
      out_file: "/home/richter/logs/pericia.out.log",
      time: true
    }
  ]
}