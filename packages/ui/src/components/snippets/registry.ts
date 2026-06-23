import type { FormElementType } from "@repo/types";
import type { ComponentType } from "react";

import { TextInputSnippet } from "./text-input-snippet";
import { TextareaSnippet } from "./textarea-snippet";
import { RatingSnippet } from "./rating-snippet";
import { MultipleChoiceSnippet } from "./multiple-choice-snippet";
import { CheckboxSnippet } from "./checkbox-snippet";
import { DropdownSnippet } from "./dropdown-snippet";
import { EmailSnippet } from "./email-snippet";
import { PhoneSnippet } from "./phone-snippet";
import { DatePickerSnippet } from "./date-picker-snippet";
import { HeadingSnippet } from "./heading-snippet";
import { ParagraphSnippet } from "./paragraph-snippet";

// ============================================
// SNIPPET REGISTRY
// Maps every FormElement "type" string to its React component.
// Adding a new snippet = create component + add one line here.
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const snippetRegistry: Record<FormElementType, ComponentType<any>> = {
  textInput: TextInputSnippet,
  textarea: TextareaSnippet,
  rating: RatingSnippet,
  multipleChoice: MultipleChoiceSnippet,
  checkbox: CheckboxSnippet,
  dropdown: DropdownSnippet,
  email: EmailSnippet,
  phone: PhoneSnippet,
  datePicker: DatePickerSnippet,
  heading: HeadingSnippet,
  paragraph: ParagraphSnippet,
};
