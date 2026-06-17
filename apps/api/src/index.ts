import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import healthRouter from "./routes/health";

const app = express();


app.use(cors());
app.use(express.json());


app.use("/", healthRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});


const server = app.listen(3000, () => {
  console.log("Express API running on port 3000");
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error("Port 3000 is already in use");
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
