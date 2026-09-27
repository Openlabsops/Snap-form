import { describe, expect, it } from "bun:test";
import {
  DASHBOARD_PATH,
  getAuthenticatedDestination,
  hasCompletedProfile,
  ONBOARDING_PATH,
  shouldRedirectOnUnauthorized,
} from "./auth-navigation";

describe("hasCompletedProfile", () => {
  it("requires a username and name", () => {
    expect(hasCompletedProfile({ username: "snap", name: "Snap Form" })).toBe(
      true,
    );
    expect(hasCompletedProfile({ username: "snap" })).toBe(false);
    expect(hasCompletedProfile({ name: "Snap Form" })).toBe(false);
    expect(hasCompletedProfile({ fullName: "Snap Form" })).toBe(false);
  });

  it("accepts fullName from an OAuth provider", () => {
    expect(
      hasCompletedProfile({ username: "snap", fullName: "Snap Form" }),
    ).toBe(true);
  });

  it("rejects whitespace-only usernames", () => {
    expect(hasCompletedProfile({ username: " ", name: "Snap Form" })).toBe(
      false,
    );
  });
});

describe("getAuthenticatedDestination", () => {
  it("sends incomplete profiles to onboarding", () => {
    expect(getAuthenticatedDestination(null)).toBe(ONBOARDING_PATH);
    expect(getAuthenticatedDestination({ name: "Snap Form" })).toBe(
      ONBOARDING_PATH,
    );
  });

  it("sends complete profiles to the dashboard", () => {
    expect(getAuthenticatedDestination({ username: "snap", name: "Snap Form" })).toBe(
      DASHBOARD_PATH,
    );
  });
});

describe("shouldRedirectOnUnauthorized", () => {
  it("keeps the auth entry page in place", () => {
    expect(shouldRedirectOnUnauthorized("/")).toBe(false);
  });

  it("sends expired sessions on protected and onboarding routes home", () => {
    expect(shouldRedirectOnUnauthorized("/onboarding")).toBe(true);
    expect(shouldRedirectOnUnauthorized("/dashboard")).toBe(true);
    expect(shouldRedirectOnUnauthorized("/forms/create")).toBe(true);
  });
});
