/**
 * Type-safe check for Prisma-like error codes.
 * Avoids instanceof and explicit type casts to unknown.
 */
export function isPrismaErrorCode(err: unknown, code: string): boolean {
  return !!(err && typeof err === "object" && (err as { code?: unknown }).code === code);
}