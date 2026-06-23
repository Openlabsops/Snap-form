import type { FormDefinition, FormResponseData } from "@repo/types";
import { snippetRegistry } from "./registry";

type FormRendererProps = {
  /** Parsed, validated form definition */
  definition: FormDefinition;
  /** Current response values keyed by element id */
  values?: FormResponseData;
  /** Called when any field value changes */
  onChange?: (elementId: string, value: FormResponseData[string]) => void;
  /** When true, all snippets render in read-only mode (e.g. builder preview) */
  readOnly?: boolean;
  /** Optional className for the wrapper div */
  className?: string;
};

/**
 * FormRenderer
 *
 * Iterates over a FormDefinition's elements array and renders the
 * appropriate snippet component for each element using the registry.
 *
 * Usage:
 *   <FormRenderer definition={parsedForm} values={state} onChange={handleChange} />
 */
export function FormRenderer({
  definition,
  values = {},
  onChange,
  readOnly = false,
  className,
}: FormRendererProps) {
  return (
    <div className={["flex flex-col gap-6", className].filter(Boolean).join(" ")}>
      {definition.elements.map((element) => {
        const SnippetComponent = snippetRegistry[element.type];

        // Guard: if a type is somehow not in the registry (e.g. future DB data
        // with a type added before a frontend deploy), render a fallback.
        if (!SnippetComponent) {
          return (
            <div
              key={element.id}
              className="rounded-md border border-dashed border-muted-foreground/30 px-4 py-3 text-sm text-muted-foreground"
            >
              Unknown element type:{" "}
              <code className="font-mono text-xs">{element.type}</code>
            </div>
          );
        }

        return (
          <SnippetComponent
            key={element.id}
            element={element}
            value={values[element.id]}
            onChange={(value: FormResponseData[string]) =>
              onChange?.(element.id, value)
            }
            readOnly={readOnly}
          />
        );
      })}
    </div>
  );
}
