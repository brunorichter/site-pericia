const { spawn } = require("child_process");

const PORT = process.env.PORT || "21092";
const HOST = process.env.HOST || "0.0.0.0";

const child = spawn(process.execPath, [
  "./node_modules/next/dist/bin/next",
  "start",
  "-p", PORT,
  "-H", HOST
], { stdio: "inherit" });

const stop = sig => () => child.kill(sig);
process.on("SIGINT", stop("SIGINT"));
process.on("SIGTERM", stop("SIGTERM"));