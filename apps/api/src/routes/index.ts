import { Router } from "express";
import healthRouter from "./health";
import userAuthRouter from "./user/auth.routes";
import adminAuthRouter from "./admin/auth.routes";
import formRouter from "./form/form.routes";
import responseRouter from "./form/response.routes";
import publicRouter from "./public/public.routes";

const router: Router = Router();

router.use("/", healthRouter);

router.use("/api/v1/auth/manual", userAuthRouter);
router.use("/api/v1/admin/auth", adminAuthRouter);
router.use("/api/v1/forms", formRouter);
router.use("/api/v1/forms/:id/responses", responseRouter);
router.use("/api/v1/public", publicRouter);

export default router;
