/// <reference types="bun-types" />
import { describe, it, expect, beforeEach } from "bun:test";
import { createAuthenticatedClient, createAnonymousClient } from "../setup/auth";
import { cleanDb } from "../setup/db";
import { prisma } from "@repo/db";

describe("Forms API", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  describe("Unauthenticated Access", () => {
    it("should return 401 Unauthorized when getting forms list", async () => {
      const anonClient = createAnonymousClient();
      const response = await anonClient.get("/api/v1/forms");
      expect(response.status).toBe(401);
    });

    it("should return 401 Unauthorized when creating a form", async () => {
      const anonClient = createAnonymousClient();
      const response = await anonClient.post("/api/v1/forms", {
        title: "Unauthorized Form",
      });
      expect(response.status).toBe(401);
    });
  });

  describe("Authenticated Access", () => {
    it("should successfully create a new form with valid parameters", async () => {
      const { client, user } = await createAuthenticatedClient();
      
      const response = await client.post("/api/v1/forms", {
        title: "Test User Form",
        description: "This is a test description",
        slug: "test-slug-123",
      });

      expect(response.status).toBe(201);
      expect(response.data.data).toHaveProperty("id");
      expect(response.data.data.title).toBe("Test User Form");
      expect(response.data.data.description).toBe("This is a test description");
      expect(response.data.data.slug).toBe("test-slug-123");
      expect(response.data.data.userId).toBe(user.id);

      // Verify it actually got stored in the DB
      const dbForm = await prisma.form.findUnique({
        where: { id: response.data.data.id },
      });
      expect(dbForm).not.toBeNull();
      expect(dbForm?.title).toBe("Test User Form");
    });

    it("should fail to create a form with invalid parameters", async () => {
      const { client } = await createAuthenticatedClient();
      
      // Title is empty, which is invalid
      const response = await client.post("/api/v1/forms", {
        title: "",
      });

      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data).toHaveProperty("errors");
    });

    it("should return only forms owned by the authenticated user", async () => {
      const userA = await createAuthenticatedClient({ email: "userA@example.com" });
      const userB = await createAuthenticatedClient({ email: "userB@example.com" });

      // Create a form for User A
      await userA.client.post("/api/v1/forms", {
        title: "User A Form",
        slug: "user-a-form",
      });

      // Create a form for User B
      await userB.client.post("/api/v1/forms", {
        title: "User B Form",
        slug: "user-b-form",
      });

      // List forms as User A
      const responseA = await userA.client.get("/api/v1/forms");
      expect(responseA.status).toBe(200);
      expect(responseA.data.data.length).toBe(1);
      expect(responseA.data.data[0].title).toBe("User A Form");

      // List forms as User B
      const responseB = await userB.client.get("/api/v1/forms");
      expect(responseB.status).toBe(200);
      expect(responseB.data.data.length).toBe(1);
      expect(responseB.data.data[0].title).toBe("User B Form");
    });
  });
});
