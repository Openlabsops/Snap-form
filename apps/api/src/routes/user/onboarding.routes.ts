import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import { completeOnboarding } from "../../controllers/onboarding.controller";

const router: Router = Router();

router.post("/", requireAuth, completeOnboarding);

export default router;
