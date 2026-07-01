import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import { validate } from "../../middleware/validate";
import { CreateTemplateSchema } from "../../lib/template-schemas";
import {
  createTemplate,
  getCommunityTemplates,
  getOwnedTemplates,
} from "../../controllers/template.controller";

const router: Router = Router();

// GET /api/v1/templates/community
router.get("/community", getCommunityTemplates);

// GET /api/v1/templates/owned
router.get("/owned", requireAuth, getOwnedTemplates);

// POST /api/v1/templates
router.post("/", requireAuth, validate(CreateTemplateSchema), createTemplate);

export default router;
