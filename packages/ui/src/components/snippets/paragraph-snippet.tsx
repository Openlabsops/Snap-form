import type { ParagraphSnippetProps } from "./types";

export function ParagraphSnippet({ element }: ParagraphSnippetProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-foreground leading-relaxed">{element.label}</p>
      {element.description && (
        <p className="text-xs text-muted-foreground">{element.description}</p>
      )}
    </div>
  );
}
