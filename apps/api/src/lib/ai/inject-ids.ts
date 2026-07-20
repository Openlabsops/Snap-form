export function injectIds(definition: { elements?: { id?: string; options?: { id?: string }[] | null }[] }) {

    if (!Array.isArray(definition?.elements)) return;

    for (const el of definition.elements) {
        el.id = crypto.randomUUID();
        if (Array.isArray(el.options)) {
            for (const opt of el.options) {
                opt.id = crypto.randomUUID();
            }
        }
    }
}
