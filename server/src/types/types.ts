export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  gender?: string;
  role?: 'USER' | 'ADMIN';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  categoryId?: number;
  authorId?: number;
  tags?: string[];
  coverImageBytes?: Uint8Array; // simpler, no <ArrayBuffer>
}
