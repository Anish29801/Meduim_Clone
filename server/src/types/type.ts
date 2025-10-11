export interface JwtPayload {
  id: number;
  email: string;
  isAdmin?: boolean;
}

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  gender?: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}
