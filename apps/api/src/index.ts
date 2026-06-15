import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("API running");
});

const server = app.listen(3001, () => {
  console.log("Express API running on port 3001");
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error("Port 3001 is already in use");
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});

const shutdown = () => {
  console.log("Shutting down API server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
