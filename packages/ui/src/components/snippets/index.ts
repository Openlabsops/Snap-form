// Renderer (the main consumer-facing export)
export { FormRenderer } from "./form-renderer";

// Registry (useful for form builders that need the full list)
export { snippetRegistry } from "./registry";
export type { SnippetType } from "./registry";

// Individual snippets (if you need to render one directly)
export { TextInputSnippet } from "./text-input-snippet";
export { NumberInputSnippet } from "./number-input-snippet";
export { RatingSnippet } from "./rating-snippet";
export { MultipleChoiceSnippet } from "./multiple-choice-snippet";
export { CheckboxSnippet } from "./checkbox-snippet";
export { DropdownSnippet } from "./dropdown-snippet";
export { EmailSnippet } from "./email-snippet";

// Prop types
export type * from "./types";
