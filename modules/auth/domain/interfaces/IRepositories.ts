import { User, Session } from "../entities/User";

export type EmailVerificationTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
};

export type PasswordResetTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
};

export type AuditLogEntry = {
  id: string;
  userId: string | null;
  action: string;
  metadata: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  user?: { email: string } | null;
};

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  incrementFailedLogins(id: string): Promise<User>;
  resetFailedLogins(id: string): Promise<User>;
}

export interface ISessionRepository {
  createSession(data: Partial<Session>): Promise<Session>;
  findActiveSessions(userId: string): Promise<Session[]>;
  findById(id: string): Promise<Session | null>;
  revokeSession(id: string): Promise<void>;
  revokeAllUserSessions(userId: string): Promise<void>;
}

export interface IPasswordResetRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<PasswordResetTokenRecord | null>;
  deleteByUserId(userId: string): Promise<void>;
}

export interface IEmailVerificationRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<EmailVerificationTokenRecord | null>;
  deleteByUserId(userId: string): Promise<void>;
}

export interface IAuditRepository {
  log(
    userId: string | null,
    action: string,
    ipAddress: string | null,
    userAgent: string | null,
    metadata?: object,
  ): Promise<void>;
  findManyByUserId(userId: string): Promise<AuditLogEntry[]>;
  findAll(): Promise<AuditLogEntry[]>;
}
