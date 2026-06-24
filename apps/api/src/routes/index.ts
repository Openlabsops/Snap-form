import { Router } from "express";
import healthRouter from "./health";
import userAuthRouter from "./user/auth.routes";
import adminAuthRouter from "./admin/auth.routes";
import formRouter from "./form/form.routes";
import responseRouter from "./form/response.routes";
import publicRouter from "./public/public.routes";
import oauthRouter from "./user/oauth.routes";
import templateRouter from "./template/template.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";


const router: Router = Router();

router.use("/", healthRouter);

router.all("/api/auth/*", toNodeHandler(auth));

router.use("/api/v1/auth/manual", userAuthRouter);
router.use("/api/v1/auth/oauth", oauthRouter);
router.use("/api/v1/admin/auth", adminAuthRouter);
router.use("/api/v1/forms", formRouter);
router.use("/api/v1/forms/:id/responses", responseRouter);
router.use("/api/v1/public", publicRouter);
router.use("/api/v1/templates", templateRouter);

export default router;
