import type {
  TextInputElement,
  TextareaElement,
  RatingElement,
  MultipleChoiceElement,
  CheckboxElement,
  DropdownElement,
  EmailElement,
  PhoneElement,
  DatePickerElement,
  HeadingElement,
  ParagraphElement,
} from "@repo/types";

// ============================================
// SHARED PROP SHAPE
// Each snippet component receives its typed element definition
// plus an onChange callback to report its current value back up.
// ============================================

export type SnippetProps<T, V = string | number | boolean | string[] | null> = {
  element: T;
  value?: V;
  onChange?: (value: V) => void;
  /** Render in read-only mode (e.g. inside the form builder preview) */
  readOnly?: boolean;
};

export type TextInputSnippetProps = SnippetProps<TextInputElement, string>;
export type TextareaSnippetProps = SnippetProps<TextareaElement, string>;
export type RatingSnippetProps = SnippetProps<RatingElement, number>;
export type MultipleChoiceSnippetProps = SnippetProps<MultipleChoiceElement, string>;
export type CheckboxSnippetProps = SnippetProps<CheckboxElement, string[]>;
export type DropdownSnippetProps = SnippetProps<DropdownElement, string>;
export type EmailSnippetProps = SnippetProps<EmailElement, string>;
export type PhoneSnippetProps = SnippetProps<PhoneElement, string>;
export type DatePickerSnippetProps = SnippetProps<DatePickerElement, string>;
export type HeadingSnippetProps = SnippetProps<HeadingElement, never>;
export type ParagraphSnippetProps = SnippetProps<ParagraphElement, never>;
