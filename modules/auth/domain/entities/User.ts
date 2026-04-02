export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "MEMBER" | "USER";
  isEmailVerified: boolean;
  isActive: boolean;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  jti: string;
  fingerprint: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}
