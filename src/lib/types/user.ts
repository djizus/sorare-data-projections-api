export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  discordId: string;
  accessToken: string;
  tokenCreatedAt: Date;
  tokenExpiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 