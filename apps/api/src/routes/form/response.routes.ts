import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import { validate } from "../../middleware/validate";
import { SubmitResponseSchema } from "../../lib/form-schemas";
import { submitResponse, listResponses } from "../../controllers/response.controller";

const responseRouter: Router = Router({ mergeParams: true });

// Public — anyone with the form link can submit
responseRouter.post("/", validate(SubmitResponseSchema), submitResponse);

// Private — only the form owner can view responses
responseRouter.get("/", requireAuth, listResponses);

export default responseRouter;
