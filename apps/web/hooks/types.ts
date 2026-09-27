export interface SocialLinks {
  x?: string;
  linkedin?: string;
  instagram?: string;
}

export interface OnboardingPayload {
  fullName?: string;
  name?: string;
  username: string;
  socialLinks?: SocialLinks;
}

export interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | string;
  plan: "FREE" | "PREMIUM" | "BUSINESS" | string;
  onboardingCompleted: boolean;
  socialLinks?: SocialLinks;
  createdAt?: string;
  updatedAt?: string;
}

export interface OnboardingResponse {
  success: boolean;
  user: UserProfile;
  message?: string;
}

export interface CheckUsernameResponse {
  success: boolean;
  available: boolean;
  isAvailable?: boolean;
  message?: string;
}

export interface UserProfileResponse {
  success: boolean;
  user: UserProfile;
  message?: string;
}
