// server.js
const http = require('http');
const next = require('next');

const port = Number(process.env.PORT) || 21096;
const hostname = process.env.HOST || '0.0.0.0';
const dev = false; // produção

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

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