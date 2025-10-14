const { spawn } = require("child_process");

const PORT = process.env.PORT || "21092";
const HOST = process.env.HOST || "0.0.0.0";



http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Hello Node')
}).listen(PORT)

/*
const child = spawn(process.execPath, [
  "./node_modules/next/dist/bin/next",
  "start",
  "-p", PORT,
  "-H", HOST
], { stdio: "inherit" });

const stop = sig => () => child.kill(sig);
process.on("SIGINT", stop("SIGINT"));
process.on("SIGTERM", stop("SIGTERM"));
*/