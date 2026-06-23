import type { CheckboxSnippetProps } from "./types";

export function CheckboxSnippet({
  element,
  value = [],
  onChange,
  readOnly,
}: CheckboxSnippetProps) {
  const toggle = (optionId: string) => {
    if (readOnly) return;
    const next = value.includes(optionId)
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];
    onChange?.(next);
  };

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
            type="checkbox"
            value={option.id}
            checked={value.includes(option.id)}
            disabled={readOnly}
            onChange={() => toggle(option.id)}
            className="h-4 w-4 rounded accent-primary"
          />
          <span className="text-sm group-hover:text-foreground transition-colors">
            {option.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
