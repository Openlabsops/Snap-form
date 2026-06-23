import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import { validate } from "../../middleware/validate";
import { CreateFormSchema, UpdateFormSchema } from "../../lib/form-schemas";
import {
  listForms,
  createForm,
  getForm,
  updateForm,
  deleteForm,
  togglePublish,
} from "../../controllers/form.controller";

const formRouter: Router = Router();

// All form routes require authentication
formRouter.use(requireAuth);

formRouter.get("/", listForms);
formRouter.post("/", validate(CreateFormSchema), createForm);
formRouter.get("/:id", getForm);
formRouter.patch("/:id", validate(UpdateFormSchema), updateForm);
formRouter.delete("/:id", deleteForm);
formRouter.post("/:id/publish", togglePublish);

export default formRouter;
