import type { RatingSnippetProps } from "./types";

export function RatingSnippet({ element, value = 0, onChange, readOnly }: RatingSnippetProps) {
  const stars = Array.from({ length: element.max }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium leading-none">
        {element.label}
        {element.required && <span className="ml-1 text-destructive">*</span>}
      </span>
      {element.description && (
        <p className="text-xs text-muted-foreground">{element.description}</p>
      )}
      <div className="flex gap-1" role="radiogroup" aria-label={element.label}>
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} out of ${element.max}`}
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            className={[
              "text-2xl leading-none transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
              value >= star ? "text-yellow-400" : "text-muted-foreground/30",
              readOnly ? "cursor-default" : "cursor-pointer",
            ].join(" ")}
          >
            ★
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-xs text-muted-foreground">
          {value} / {element.max}
        </p>
      )}
    </div>
  );
}
