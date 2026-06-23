import { Router } from "express";
import { validate } from "../../middleware/validate";
import { SubmitResponseSchema } from "../../lib/form-schemas";
import { getPublicForm } from "../../controllers/public.controller";
import { submitResponse } from "../../controllers/response.controller";

const publicRouter: Router = Router();

// GET /api/v1/public/forms/:slug  — fetch a published form definition
publicRouter.get("/forms/:slug", getPublicForm);

// POST /api/v1/public/forms/:slug/responses  — submit a response (also public)
publicRouter.post(
  "/forms/:slug/responses",
  validate(SubmitResponseSchema),
  async (req, res, next) => {
    const { prisma } = await import("@repo/db");
    const form = await prisma.form.findFirst({
      where: { slug: req.params["slug"], published: true },
      select: { id: true },
    });
    if (!form) {
      res.status(404).json({ success: false, message: "Form not found" });
      return;
    }
    req.params["id"] = form.id;
    next();
  },
  submitResponse,
);

export default publicRouter;
