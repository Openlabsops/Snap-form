import { Router } from "express";
import healthRouter from "./health";
import userAuthRouter from "./user/auth.routes";
import adminAuthRouter from "./admin/auth.routes";

const router:Router = Router();


router.use("/", healthRouter);


router.use("/api/v1/auth/manual", userAuthRouter);


router.use("/api/v1/admin/auth", adminAuthRouter);

export default router;
