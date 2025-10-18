export interface SignUpProps {
  onSubmit?: (
    username: string,
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
    bio: string,
    avatar: 'male' | 'female' | '',
    gender: string,
    role: 'USER' | 'ADMIN'
  ) => void;
}

export interface LoginProps {
  onSubmit?: (email: string, password: string, confirmPassword: string) => void;
  onGoogleLogin?: () => void;
}

export interface UpdateUserProps {
  userId?: string;
  onUpdate?: () => void;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  bio?: string;
  gender?: string;
  avatar?: string;
  role?: string;
}
