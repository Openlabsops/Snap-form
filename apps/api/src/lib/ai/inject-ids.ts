import { randomUUID } from "node:crypto";

export function injectIds(definition: { elements?: unknown[] }) {
  if (!Array.isArray(definition?.elements)) return;

  for (const el of definition.elements) {
    if (!el || typeof el !== "object") continue;
    (el as Record<string, unknown>).id = randomUUID();
    const opts = (el as Record<string, unknown>).options;
    if (Array.isArray(opts)) {
      for (const opt of opts) {
        if (!opt || typeof opt !== "object") continue;
        (opt as Record<string, unknown>).id = randomUUID();
      }
    }
  }
}
