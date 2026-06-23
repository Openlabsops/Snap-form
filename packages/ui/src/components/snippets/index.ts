// Renderer (the main consumer-facing export)
export { FormRenderer } from "./form-renderer";

// Registry (useful for form builders that need the full list)
export { snippetRegistry } from "./registry";

// Individual snippets (if you need to render one directly)
export { TextInputSnippet } from "./text-input-snippet";
export { TextareaSnippet } from "./textarea-snippet";
export { RatingSnippet } from "./rating-snippet";
export { MultipleChoiceSnippet } from "./multiple-choice-snippet";
export { CheckboxSnippet } from "./checkbox-snippet";
export { DropdownSnippet } from "./dropdown-snippet";
export { EmailSnippet } from "./email-snippet";
export { PhoneSnippet } from "./phone-snippet";
export { DatePickerSnippet } from "./date-picker-snippet";
export { HeadingSnippet } from "./heading-snippet";
export { ParagraphSnippet } from "./paragraph-snippet";

// Prop types
export type * from "./types";
