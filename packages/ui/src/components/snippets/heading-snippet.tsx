import type { HeadingSnippetProps } from "./types";

const TAG_MAP = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
} as const;

const SIZE_MAP = {
  h1: "text-2xl font-bold",
  h2: "text-xl font-semibold",
  h3: "text-base font-semibold",
} as const;

export function HeadingSnippet({ element }: HeadingSnippetProps) {
  const Tag = TAG_MAP[element.level];
  return (
    <div className="flex flex-col gap-1">
      <Tag className={SIZE_MAP[element.level]}>{element.label}</Tag>
      {element.description && (
        <p className="text-sm text-muted-foreground">{element.description}</p>
      )}
    </div>
  );
}
