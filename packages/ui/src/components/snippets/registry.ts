import type { ComponentType } from "react";

import { TextInputSnippet } from "./text-input-snippet";
import { NumberInputSnippet } from "./number-input-snippet";
import { RatingSnippet } from "./rating-snippet";
import { MultipleChoiceSnippet } from "./multiple-choice-snippet";
import { CheckboxSnippet } from "./checkbox-snippet";
import { DropdownSnippet } from "./dropdown-snippet";
import { EmailSnippet } from "./email-snippet";

// ============================================
// SNIPPET REGISTRY
// Maps every supported snippet "type" string to its React component.
// Adding a new snippet = create component + add one line here.
// ============================================

export type SnippetType =
  | "textInput"
  | "numberInput"
  | "email"
  | "dropdown"
  | "multipleChoice"
  | "checkbox"
  | "rating";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const snippetRegistry: Record<SnippetType, ComponentType<any>> = {
  textInput: TextInputSnippet,
  numberInput: NumberInputSnippet,
  rating: RatingSnippet,
  multipleChoice: MultipleChoiceSnippet,
  checkbox: CheckboxSnippet,
  dropdown: DropdownSnippet,
  email: EmailSnippet,
};
