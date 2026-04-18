export interface JwtPayload {
  userId: string;
  username: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}
