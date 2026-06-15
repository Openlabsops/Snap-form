import cron from "node-cron";

console.log("Worker service starting up...");

const task = cron.schedule("* * * * *", () => {
  try {
    console.log("Running job...");
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});

const shutdown = () => {
  console.log("Shutting down worker...");
  task.stop();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
