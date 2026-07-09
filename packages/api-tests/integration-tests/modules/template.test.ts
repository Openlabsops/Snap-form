/// <reference types="bun-types" />
import { describe, it, expect, beforeEach } from "bun:test";
import { createAuthenticatedClient, createAnonymousClient } from "../setup/auth";
import { cleanDb } from "../setup/db";
import { prisma } from "@repo/db";

// ---------------------------------------------------------------------------
// Minimal valid fields payload (matches FormDefinitionSchema in @repo/types)
// ---------------------------------------------------------------------------
const SAMPLE_FIELDS = {
  version: "1.0",
  elements: [
    {
      id: "00000000-0000-0000-0000-000000000001",
      type: "textInput",
      label: "Name",
      required: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a public community template via the API */
async function createPublicTemplate(
  client: Awaited<ReturnType<typeof createAuthenticatedClient>>["client"],
  overrides: Record<string, unknown> = {},
) {
  return client.post("/api/v1/templates", {
    title: "Sample Community Template",
    description: "A template for integration tests",
    category: "HR",
    price: 0,
    isPublic: true,
    fields: SAMPLE_FIELDS,
    ...overrides,
  });
}

// ===========================================================================
// Test Suite
// ===========================================================================

describe("Template Community Routes", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  // =========================================================================
  // Test Case 1 — POST /api/v1/templates
  // =========================================================================

  describe("POST /api/v1/templates — create a public community template", () => {
    it("should return 401 when creating a template without authentication", async () => {
      const anonClient = createAnonymousClient();
      const response = await anonClient.post("/api/v1/templates", {
        title: "Anon Template",
        fields: SAMPLE_FIELDS,
      });

      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
    });

    it("should return 400 when title is missing", async () => {
      const { client } = await createAuthenticatedClient();
      const response = await client.post("/api/v1/templates", {
        fields: SAMPLE_FIELDS,
      });

      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
    });

    it("should return 400 when neither formId nor fields are provided", async () => {
      const { client } = await createAuthenticatedClient();
      const response = await client.post("/api/v1/templates", {
        title: "Missing Fields Template",
      });

      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
    });

    it("should correctly create a public community template with fields", async () => {
      const { client, user } = await createAuthenticatedClient();

      const response = await createPublicTemplate(client, {
        title: "Public HR Template",
        category: "HR",
      });

      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);

      const template = response.data.data;
      expect(template).toHaveProperty("id");
      expect(template.title).toBe("Public HR Template");
      expect(template.category).toBe("HR");
      expect(template.isPublic).toBe(true);
      expect(template.price).toBe(0);
      expect(template.userId).toBe(user.id);

      // Verify persistence in DB
      const dbTemplate = await prisma.template.findUnique({
        where: { id: template.id },
      });
      expect(dbTemplate).not.toBeNull();
      expect(dbTemplate?.title).toBe("Public HR Template");
      expect(dbTemplate?.isPublic).toBe(true);
    });

    it("should snapshot fields from an existing form when formId is provided", async () => {
      const { client, user } = await createAuthenticatedClient();

      // Create a form first so we have a valid formId
      const formResponse = await client.post("/api/v1/forms", {
        title: "Source Form",
        slug: `source-form-${Date.now()}`,
      });
      expect(formResponse.status).toBe(201);
      const formId = formResponse.data.data.id;

      const response = await client.post("/api/v1/templates", {
        title: "Snapshot Template",
        formId,
      });

      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data.userId).toBe(user.id);
    });
  });

  // =========================================================================
  // Test Case 2 — GET /api/v1/templates/community
  // =========================================================================

  describe("GET /api/v1/templates/community — returns public templates with category filtering", () => {
    it("should be accessible without authentication", async () => {
      const anonClient = createAnonymousClient();
      const response = await anonClient.get("/api/v1/templates/community");

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
    });

    it("should return only public templates", async () => {
      const { user } = await createAuthenticatedClient();

      // Seed one public and one private template directly
      await prisma.template.create({
        data: {
          title: "Public Template",
          isPublic: true,
          userId: user.id,
        },
      });
      await prisma.template.create({
        data: {
          title: "Private Template",
          isPublic: false,
          userId: user.id,
        },
      });

      const anonClient = createAnonymousClient();
      const response = await anonClient.get("/api/v1/templates/community");

      expect(response.status).toBe(200);
      expect(response.data.data.length).toBe(1);
      expect(response.data.data[0].title).toBe("Public Template");
      expect(response.data.data[0].isPublic).toBe(true);
    });

    it("should respect the category filter query parameter", async () => {
      const { client } = await createAuthenticatedClient();

      // Create templates in two different categories
      await createPublicTemplate(client, {
        title: "HR Template",
        category: "HR",
      });
      await createPublicTemplate(client, {
        title: "Finance Template",
        category: "Finance",
      });

      const anonClient = createAnonymousClient();
      const hrResponse = await anonClient.get(
        "/api/v1/templates/community?category=HR",
      );

      expect(hrResponse.status).toBe(200);
      expect(hrResponse.data.data.length).toBe(1);
      expect(hrResponse.data.data[0].title).toBe("HR Template");
      expect(hrResponse.data.data[0].category).toBe("HR");
    });

    it("should return correct pagination metadata", async () => {
      const { user } = await createAuthenticatedClient();

      // Seed 5 public templates
      for (let i = 1; i <= 5; i++) {
        await prisma.template.create({
          data: {
            title: `Template ${i}`,
            isPublic: true,
            userId: user.id,
          },
        });
      }

      const anonClient = createAnonymousClient();
      const response = await anonClient.get(
        "/api/v1/templates/community?page=1&limit=3",
      );

      expect(response.status).toBe(200);
      expect(response.data.data.length).toBe(3);
      expect(response.data.pagination.total).toBe(5);
      expect(response.data.pagination.page).toBe(1);
      expect(response.data.pagination.limit).toBe(3);
      expect(response.data.pagination.totalPages).toBe(2);
    });

    it("should include creator details in each community template listing", async () => {
      const { client } = await createAuthenticatedClient();

      await createPublicTemplate(client, { title: "Template With Creator" });

      const anonClient = createAnonymousClient();
      const response = await anonClient.get("/api/v1/templates/community");

      expect(response.status).toBe(200);
      expect(response.data.data.length).toBeGreaterThanOrEqual(1);

      const template = response.data.data[0];
      expect(template).toHaveProperty("user");
      expect(template.user).toHaveProperty("id");
      expect(template.user).toHaveProperty("name");
    });
  });

  // =========================================================================
  // Test Case 3 — POST /api/v1/templates/:id/purchase
  // =========================================================================

  describe("POST /api/v1/templates/:id/purchase — adds template to UserOwnedTemplate", () => {
    it("should return 401 when purchasing without authentication", async () => {
      const { user } = await createAuthenticatedClient();

      // Seed a template to purchase
      const template = await prisma.template.create({
        data: { title: "Template To Buy", isPublic: true, userId: user.id },
      });

      const anonClient = createAnonymousClient();
      const response = await anonClient.post(
        `/api/v1/templates/${template.id}/purchase`,
      );

      expect(response.status).toBe(401);
    });

    it("should return 404 when purchasing a non-existent template", async () => {
      const { client } = await createAuthenticatedClient();
      const response = await client.post(
        "/api/v1/templates/nonexistent-id/purchase",
      );

      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });

    it("should return 400 when a user tries to purchase their own template", async () => {
      const { client, user } = await createAuthenticatedClient();

      const template = await prisma.template.create({
        data: { title: "Own Template", isPublic: true, userId: user.id },
      });

      const response = await client.post(
        `/api/v1/templates/${template.id}/purchase`,
      );

      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data.message).toContain("own template");
    });

    it("should correctly add the template to the buyer's UserOwnedTemplate list", async () => {
      // Seller creates a template
      const seller = await createAuthenticatedClient({
        email: `seller-${Date.now()}@test.com`,
      });
      const templateRes = await createPublicTemplate(seller.client, {
        title: "Purchasable Template",
      });
      expect(templateRes.status).toBe(201);
      const templateId = templateRes.data.data.id;

      // Buyer purchases the template
      const buyer = await createAuthenticatedClient({
        email: `buyer-${Date.now()}@test.com`,
      });
      const purchaseRes = await buyer.client.post(
        `/api/v1/templates/${templateId}/purchase`,
      );

      expect(purchaseRes.status).toBe(201);
      expect(purchaseRes.data.success).toBe(true);
      expect(purchaseRes.data.data).toHaveProperty("purchase");
      expect(purchaseRes.data.data).toHaveProperty("clonedForm");
      expect(purchaseRes.data.data.clonedForm).toHaveProperty("id");

      // Verify a UserOwnedTemplate record was created in the DB
      const ownership = await prisma.userOwnedTemplate.findUnique({
        where: {
          userId_templateId: { userId: buyer.user.id, templateId },
        },
      });
      expect(ownership).not.toBeNull();
      expect(ownership?.userId).toBe(buyer.user.id);
      expect(ownership?.templateId).toBe(templateId);

      // Verify the cloned Form exists and is owned by the buyer
      const clonedForm = await prisma.form.findUnique({
        where: { id: purchaseRes.data.data.clonedForm.id },
      });
      expect(clonedForm).not.toBeNull();
      expect(clonedForm?.userId).toBe(buyer.user.id);
      expect(clonedForm?.published).toBe(false);
    });

    it("should increment the template useCount after purchase", async () => {
      const seller = await createAuthenticatedClient({
        email: `seller2-${Date.now()}@test.com`,
      });
      const templateRes = await createPublicTemplate(seller.client, {
        title: "UseCount Template",
      });
      const templateId = templateRes.data.data.id;

      const buyer = await createAuthenticatedClient({
        email: `buyer2-${Date.now()}@test.com`,
      });
      await buyer.client.post(`/api/v1/templates/${templateId}/purchase`);

      const dbTemplate = await prisma.template.findUnique({
        where: { id: templateId },
      });
      expect(dbTemplate?.useCount).toBe(1);
    });

    it("should return 409 when the same user purchases the same template twice", async () => {
      const seller = await createAuthenticatedClient({
        email: `seller3-${Date.now()}@test.com`,
      });
      const templateRes = await createPublicTemplate(seller.client, {
        title: "Double Purchase Template",
      });
      const templateId = templateRes.data.data.id;

      const buyer = await createAuthenticatedClient({
        email: `buyer3-${Date.now()}@test.com`,
      });

      // First purchase
      await buyer.client.post(`/api/v1/templates/${templateId}/purchase`);

      // Second purchase — should conflict
      const response = await buyer.client.post(
        `/api/v1/templates/${templateId}/purchase`,
      );

      expect(response.status).toBe(409);
      expect(response.data.success).toBe(false);
      expect(response.data.message).toContain("already purchased");
    });
  });

  // =========================================================================
  // Test Case 4 — POST /api/v1/templates/:id/reviews
  // =========================================================================

  describe("POST /api/v1/templates/:id/reviews — 403 if not purchased", () => {
    it("should return 401 when leaving a review without authentication", async () => {
      const { user } = await createAuthenticatedClient();

      const template = await prisma.template.create({
        data: { title: "Review Target", isPublic: true, userId: user.id },
      });

      const anonClient = createAnonymousClient();
      const response = await anonClient.post(
        `/api/v1/templates/${template.id}/reviews`,
        { stars: 5 },
      );

      expect(response.status).toBe(401);
    });

    it("should return 403 if the user has NOT purchased the template", async () => {
      const seller = await createAuthenticatedClient({
        email: `seller4-${Date.now()}@test.com`,
      });
      const templateRes = await createPublicTemplate(seller.client, {
        title: "Review Gated Template",
      });
      const templateId = templateRes.data.data.id;

      // Stranger (never purchased)
      const stranger = await createAuthenticatedClient({
        email: `stranger-${Date.now()}@test.com`,
      });
      const response = await stranger.client.post(
        `/api/v1/templates/${templateId}/reviews`,
        { stars: 4, text: "Great template!" },
      );

      expect(response.status).toBe(403);
      expect(response.data.success).toBe(false);
      expect(response.data.message).toContain("purchase");
    });

    it("should return 403 when the template creator tries to review their own template", async () => {
      const { client, user } = await createAuthenticatedClient();

      const template = await prisma.template.create({
        data: { title: "Creator Self-Review", isPublic: true, userId: user.id },
      });

      const response = await client.post(
        `/api/v1/templates/${template.id}/reviews`,
        { stars: 5, text: "I love my own template" },
      );

      expect(response.status).toBe(403);
      expect(response.data.success).toBe(false);
    });

    it("should allow a review only after the user has purchased the template", async () => {
      const seller = await createAuthenticatedClient({
        email: `seller5-${Date.now()}@test.com`,
      });
      const templateRes = await createPublicTemplate(seller.client, {
        title: "Purchase Before Review Template",
      });
      const templateId = templateRes.data.data.id;

      // Buyer purchases the template
      const buyer = await createAuthenticatedClient({
        email: `buyer5-${Date.now()}@test.com`,
      });
      await buyer.client.post(`/api/v1/templates/${templateId}/purchase`);

      // Now the buyer leaves a review
      const reviewRes = await buyer.client.post(
        `/api/v1/templates/${templateId}/reviews`,
        { stars: 5, text: "Excellent template!" },
      );

      expect(reviewRes.status).toBe(201);
      expect(reviewRes.data.success).toBe(true);
      expect(reviewRes.data.data.stars).toBe(5);
      expect(reviewRes.data.data.text).toBe("Excellent template!");

      // Verify review exists in DB
      const review = await prisma.templateReview.findUnique({
        where: {
          templateId_userId: { templateId, userId: buyer.user.id },
        },
      });
      expect(review).not.toBeNull();
      expect(review?.stars).toBe(5);
    });

    it("should return 400 when stars is out of range (> 5)", async () => {
      const seller = await createAuthenticatedClient({
        email: `seller6-${Date.now()}@test.com`,
      });
      const templateRes = await createPublicTemplate(seller.client, {
        title: "Star Validation Template",
      });
      const templateId = templateRes.data.data.id;

      const buyer = await createAuthenticatedClient({
        email: `buyer6-${Date.now()}@test.com`,
      });
      await buyer.client.post(`/api/v1/templates/${templateId}/purchase`);

      const response = await buyer.client.post(
        `/api/v1/templates/${templateId}/reviews`,
        { stars: 6 },
      );

      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
    });

    it("should return 409 when the user tries to leave a duplicate review", async () => {
      const seller = await createAuthenticatedClient({
        email: `seller7-${Date.now()}@test.com`,
      });
      const templateRes = await createPublicTemplate(seller.client, {
        title: "Duplicate Review Template",
      });
      const templateId = templateRes.data.data.id;

      const buyer = await createAuthenticatedClient({
        email: `buyer7-${Date.now()}@test.com`,
      });
      await buyer.client.post(`/api/v1/templates/${templateId}/purchase`);

      // First review
      await buyer.client.post(`/api/v1/templates/${templateId}/reviews`, {
        stars: 4,
        text: "Good template",
      });

      // Duplicate review
      const response = await buyer.client.post(
        `/api/v1/templates/${templateId}/reviews`,
        { stars: 3, text: "Changed my mind" },
      );

      expect(response.status).toBe(409);
      expect(response.data.success).toBe(false);
      expect(response.data.message).toContain("already reviewed");
    });
  });
});
