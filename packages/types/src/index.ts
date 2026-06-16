export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type User = {
  id: string;
  email: string;
  createdAt: string;
};
