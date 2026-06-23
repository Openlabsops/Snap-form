import { describe, it, expect } from "bun:test";
import { FormDefinitionSchema, FormResponseDataSchema } from "./form-schema.js";

// ============================================
// Helpers
// ============================================

const uuid = () => crypto.randomUUID();

// A minimal valid text input element
const validTextInput = () => ({
  id: uuid(),
  type: "textInput" as const,
  label: "Full Name",
});

// A minimal valid rating element
const validRating = () => ({
  id: uuid(),
  type: "rating" as const,
  label: "Rate our service",
  max: 5,
});

// A minimal valid multipleChoice element
const validMultipleChoice = () => ({
  id: uuid(),
  type: "multipleChoice" as const,
  label: "Favourite colour",
  options: [
    { id: uuid(), label: "Red" },
    { id: uuid(), label: "Blue" },
  ],
});

// ============================================
// FormDefinitionSchema
// ============================================

describe("FormDefinitionSchema", () => {
  // ---- VALID CASES ----

  it("accepts an empty elements array", () => {
    const result = FormDefinitionSchema.safeParse({ version: "1.0", elements: [] });
    expect(result.success).toBe(true);
  });

  it("fills in version default when omitted", () => {
    const result = FormDefinitionSchema.safeParse({ elements: [] });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.version).toBe("1.0");
    }
  });

  it("fills in required:false default on elements", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [validTextInput()],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.elements[0]?.required).toBe(false);
    }
  });

  it("accepts multiple mixed element types", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [validTextInput(), validRating(), validMultipleChoice()],
    });
    expect(result.success).toBe(true);
  });

  it("accepts a heading element (no required field)", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [
        { id: uuid(), type: "heading", label: "Section 1", level: "h2" },
      ],
    });
    expect(result.success).toBe(true);
  });

  // ---- INVALID CASES ----

  it("rejects an unknown element type", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [{ id: uuid(), type: "unknownWidget", label: "Test" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an element with an empty label", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [{ id: uuid(), type: "textInput", label: "" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a textInput element with a missing id", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [{ type: "textInput", label: "Name" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a textInput element with a non-UUID id", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [{ id: "not-a-uuid", type: "textInput", label: "Name" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a rating element with max out of range", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [{ id: uuid(), type: "rating", label: "Rate", max: 99 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a multipleChoice element with fewer than 2 options", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [
        {
          id: uuid(),
          type: "multipleChoice",
          label: "Pick one",
          options: [{ id: uuid(), label: "Only option" }],
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a checkbox element with no options", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [
        { id: uuid(), type: "checkbox", label: "Pick any", options: [] },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a wrong version string", () => {
    const result = FormDefinitionSchema.safeParse({
      version: "2.0",
      elements: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects elements that is not an array", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: "not an array",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a datePicker with an invalid minDate format", () => {
    const result = FormDefinitionSchema.safeParse({
      elements: [
        {
          id: uuid(),
          type: "datePicker",
          label: "When?",
          minDate: "22-06-2026", // wrong format, must be YYYY-MM-DD
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an email element whose options have empty labels", () => {
    // options don't apply to email — ensure extra fields don't silently pass
    const result = FormDefinitionSchema.safeParse({
      elements: [
        {
          id: uuid(),
          type: "dropdown",
          label: "Country",
          options: [
            { id: uuid(), label: "" }, // empty label should fail
            { id: uuid(), label: "India" },
          ],
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});

// ============================================
// FormResponseDataSchema
// ============================================

describe("FormResponseDataSchema", () => {
  it("accepts a valid response with mixed value types", () => {
    const id1 = uuid();
    const id2 = uuid();
    const id3 = uuid();
    const result = FormResponseDataSchema.safeParse({
      [id1]: "John Doe",
      [id2]: 4,
      [id3]: ["option-a", "option-b"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts null values (explicitly cleared fields)", () => {
    const result = FormResponseDataSchema.safeParse({ [uuid()]: null });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID keys", () => {
    const result = FormResponseDataSchema.safeParse({ "not-a-uuid": "value" });
    expect(result.success).toBe(false);
  });

  it("rejects object values (only primitives and arrays allowed)", () => {
    const result = FormResponseDataSchema.safeParse({
      [uuid()]: { nested: "object" },
    });
    expect(result.success).toBe(false);
  });
});
