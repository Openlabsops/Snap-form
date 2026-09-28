export const userQueryKeys = {
  all: ["users"] as const,
  profile: () => [...userQueryKeys.all, "profile"] as const,
  checkUsername: (username: string) =>
    [...userQueryKeys.all, "check-username", username.toLowerCase().trim()] as const,
};
