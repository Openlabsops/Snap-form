import { afterEach, describe, expect, it } from "bun:test";
import { expireClientSession } from "./auth-session";

describe("expireClientSession", () => {
  type FakeWindow = {
    location: {
      pathname: string;
      href: string;
      replace: (url: string) => void;
    };
  };

  function mockWindow(pathname: string): FakeWindow {
    const fake: FakeWindow = {
      location: {
        pathname,
        href: "",
        replace: (url: string) => {
          fake.location.href = url;
        },
      },
    };
    (globalThis as unknown as { window: FakeWindow }).window = fake;
    return fake;
  }

  afterEach(() => {
    delete (globalThis as unknown as { window?: unknown }).window;
  });

  it("replaces protected routes with the auth entry path", () => {
    const fake = mockWindow("/dashboard");
    expireClientSession();
    expect(fake.location.href).toBe("/");
  });

  it("does not navigate when already on the auth entry path", () => {
    const fake = mockWindow("/");
    expireClientSession();
    expect(fake.location.href).toBe("");
  });
});
