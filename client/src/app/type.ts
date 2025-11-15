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
  author: {
    name: string;
  };
  authorAvatar: string;
  publication: string;
  image: string;
  views: number;
  comments: number;
  daysAgo: number;
  description: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface Article {
  id: number;
  title: string;
  author: {
    id: number;
    username?: string;
    fullName?: string;
  };
  category?: {
    id: number;
    name: string;
  };
  authorId: number;
  coverImageBase64?: string | null;
  categoryId: number;
  tags?: { id: number; name: string }[];
  content: string;
  createdAt?: string;
  description?: string;
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

export interface headingSearchProps {
  heading?: string;
  subHeading?: string;
  placeHolder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export interface Props {
  categories: Category[];
  onUpdate: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  page: number;
  limit: number;
}
