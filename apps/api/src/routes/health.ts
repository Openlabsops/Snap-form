import { Router, Request, Response } from "express";
import { formatUptime } from "../utils/time";

const router: Router = Router();

const serverStartTime = new Date();

router.get("/health", (_req: Request, res: Response) => {
  const uptimeSeconds = process.uptime();

  res.status(200).json({
    status: "ok",
    message: "API is healthy",
    serverTime: new Date().toISOString(),
    startedAt: serverStartTime.toISOString(),
    uptime: {
      seconds: Math.floor(uptimeSeconds),
      humanReadable: formatUptime(uptimeSeconds),
    },
  });
});

export default router;
