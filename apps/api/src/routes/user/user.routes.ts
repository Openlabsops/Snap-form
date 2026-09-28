import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import {
  getUserProfile,
  checkUsernameAvailability,
} from "../../controllers/user.controller";
import { completeOnboarding } from "../../controllers/onboarding.controller";

const router: Router = Router();

router.get("/profile", requireAuth, getUserProfile);
router.get("/me", requireAuth, getUserProfile);
router.get("/check-username", checkUsernameAvailability);
router.get("/check-username/:username", checkUsernameAvailability);
router.post("/onboarding", requireAuth, completeOnboarding);

export default router;
