import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import { validate } from "../../middleware/validate";
import { CreateTemplateSchema } from "../../lib/template-schemas";
import {
  createTemplate,
  listTemplates,
} from "../../controllers/template.controller";

const templateRouter: Router = Router();

templateRouter.get("/", listTemplates);
templateRouter.post("/", requireAuth, validate(CreateTemplateSchema), createTemplate);

export default templateRouter;
