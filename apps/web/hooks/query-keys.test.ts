import { describe, it, expect } from "bun:test";
import { userQueryKeys } from "./query-keys";

describe("userQueryKeys", () => {
  it("generates correct key for profile", () => {
    expect(userQueryKeys.profile()).toEqual(["users", "profile"]);
  });

  it("generates normalized key for checkUsername", () => {
    expect(userQueryKeys.checkUsername("My_User123 ")).toEqual([
      "users",
      "check-username",
      "my_user123",
    ]);
  });
});
