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
  onSubmit?: (email: string, password: string) => void;
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

export interface ArticlePageProps {
  articleId?: number | null;
}

export interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
}

export interface Post {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  publication: string;
  image: string;
  views: number;
  comments: number;
  daysAgo: number;
  description: string;
}

export interface Article {
  id: number;
  title: string;
  author: { id: number; name: string };
  authorId: number;
  // coverImage?: string;
  coverImageBase64?: string | null;
  categoryId: number;
  tags?: { id: number; name: string }[];
  content: string;
  createdAt?: string;
}

export interface PostPageProps {
  params: { id: string };
}

export interface Category {
  id: number;
  name: string;
  _count?: { articles: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
