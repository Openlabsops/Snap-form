import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * validate(schema)
 *
 * Returns Express middleware that parses req.body through the given Zod schema.
 * On success, replaces req.body with the parsed (and default-filled) value.
 * On failure, responds with 400 and a structured list of field errors.
 *
 * Usage:
 *   router.post("/forms", validate(CreateFormSchema), formController.create);
 */
export function validate<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    // Replace body with the parsed value so downstream handlers
    // get defaults filled in (e.g. version: "1.0", required: false, etc.)
    req.body = result.data;
    next();
  };
}

/**
 * Converts Zod's flat issue array into a path → message record.
 * E.g. { "elements[0].label": "Label cannot be empty" }
 */
function formatZodErrors(error: ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const path = issue.path.join(".");
    acc[path || "_root"] = issue.message;
    return acc;
  }, {});
}
