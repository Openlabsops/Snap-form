"use client";

import { CreateFormPage } from "@/components/pages/create-form";
import type { FormField } from "@/components/pages/create-form";

/* ── Mock Data: Pre-populated form for editing ───────────────────── */

const MOCK_EDIT_FIELDS: FormField[] = [
  {
    id: "field-edit-1",
    type: "textInput",
    label: "Full Name",
    placeholder: "Enter your full name",
    required: true,
    validateFormat: false,
    options: [],
  },
  {
    id: "field-edit-2",
    type: "email",
    label: "Work Email",
    placeholder: "name@company.com",
    required: true,
    validateFormat: true,
    options: [],
  },
  {
    id: "field-edit-3",
    type: "dropdown",
    label: "Role",
    placeholder: "Select your role",
    required: false,
    validateFormat: false,
    options: [
      { id: "opt-1", label: "Junior Developer" },
      { id: "opt-2", label: "Senior Developer" },
      { id: "opt-3", label: "Tech Lead" },
      { id: "opt-4", label: "Engineering Manager" },
    ],
  },
];

const MOCK_EDIT_TITLE = "Event Registration";
const MOCK_EDIT_DESCRIPTION =
  "Please fill out the form below to secure your spot at the upcoming developer summit.";

/* ── Edit Form Page Component ────────────────────────────────────── */

export function EditFormPage() {
  return (
    <CreateFormPage
      initialTitle={MOCK_EDIT_TITLE}
      initialDescription={MOCK_EDIT_DESCRIPTION}
      initialFields={MOCK_EDIT_FIELDS}
      isEditMode
    />
  );
}
