#!/usr/bin/env node
// Simple MCP stdio harness to call tools/list and tools/call list_vms
import { spawn } from "node:child_process";

const server = spawn("node", ["build/index.js"], {
  // Run from repo root so build/index.js resolves correctly
  cwd: new URL("..", import.meta.url).pathname,
  stdio: ["pipe", "pipe", "inherit"],
});

let buffer = "";

server.stdout.on("data", (chunk) => {
  buffer += chunk.toString("utf8");
  while (true) {
    const newlineIndex = buffer.indexOf("\n");
    if (newlineIndex === -1) break;
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (!line) continue;
    try {
      const message = JSON.parse(line);
      console.log("<<", JSON.stringify(message, null, 2));
    } catch (err) {
      console.error("Failed to parse message line:", line);
    }
  }
});

function send(message) {
  const payload = JSON.stringify(message);
  server.stdin.write(`${payload}\n`);
  console.log(">>", payload);
}

server.once("error", (err) => {
  console.error("Server process error:", err);
});

// Send list tools then call list_vms
setTimeout(() => {
  send({ jsonrpc: "2.0", id: "1", method: "tools/list", params: {} });
  send({
    jsonrpc: "2.0",
    id: "2",
    method: "tools/call",
    params: { name: "list_vms", arguments: {} },
  });
}, 100);

// Exit after a short timeout
setTimeout(() => {
  server.kill();
}, 5000);
