import type { TextInputSnippetProps } from "./types";

export function TextInputSnippet({ element, value = "", onChange, readOnly }: TextInputSnippetProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={element.id} className="text-sm font-medium leading-none">
        {element.label}
        {element.required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {element.description && (
        <p className="text-xs text-muted-foreground">{element.description}</p>
      )}
      <input
        id={element.id}
        type="text"
        readOnly={readOnly}
        placeholder={element.placeholder}
        maxLength={element.maxLength}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={element.required}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
