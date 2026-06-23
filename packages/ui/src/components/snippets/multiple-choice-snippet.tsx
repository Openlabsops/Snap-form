import type { MultipleChoiceSnippetProps } from "./types";

export function MultipleChoiceSnippet({
  element,
  value = "",
  onChange,
  readOnly,
}: MultipleChoiceSnippetProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium leading-none mb-1">
        {element.label}
        {element.required && <span className="ml-1 text-destructive">*</span>}
      </legend>
      {element.description && (
        <p className="text-xs text-muted-foreground -mt-1">{element.description}</p>
      )}
      {element.options.map((option) => (
        <label
          key={option.id}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <input
            type="radio"
            name={element.id}
            value={option.id}
            checked={value === option.id}
            disabled={readOnly}
            onChange={() => !readOnly && onChange?.(option.id)}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm group-hover:text-foreground transition-colors">
            {option.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
