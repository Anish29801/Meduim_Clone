export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  gender?: string;
  isAdmin?: boolean;
};
