import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { PrismaSessionRepository } from "../repositories/PrismaSessionRepository";
import { PrismaAuditRepository } from "../repositories/PrismaAuditRepository";
import { PrismaPasswordResetRepository } from "../repositories/PrismaPasswordResetRepository";
import { BcryptCryptoService } from "../security/BcryptCryptoService";
import { JsonWebTokenService } from "../security/JsonWebTokenService";
import { MockMailerService } from "../email/MockMailerService";
import { LoginUseCase } from "@/modules/auth/application/use-cases/LoginUseCase";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/RegisterUseCase";
import { ForgotPasswordUseCase } from "@/modules/auth/application/use-cases/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "@/modules/auth/application/use-cases/ResetPasswordUseCase";
import { VerifyEmailUseCase } from "@/modules/auth/application/use-cases/VerifyEmailUseCase";
import { ResendVerificationUseCase } from "@/modules/auth/application/use-cases/ResendVerificationUseCase";
import { GetAuditLogsUseCase } from "@/modules/auth/application/audit/GetAuditLogsUseCase";
import { PrismaEmailVerificationRepository } from "../repositories/PrismaEmailVerificationRepository";

// Singleton DB instance (Prisma v7 requires a driver adapter)
function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Repositories
const userRepository = new PrismaUserRepository(db);
const sessionRepository = new PrismaSessionRepository(db);
const auditRepository = new PrismaAuditRepository(db);
const passwordResetRepository = new PrismaPasswordResetRepository(db);
const emailVerificationRepository = new PrismaEmailVerificationRepository(db);

// Services
const cryptoService = new BcryptCryptoService();
const jwtService = new JsonWebTokenService();
const mailerService = new MockMailerService();

// Use Cases
export const loginUseCase = new LoginUseCase(
  userRepository,
  sessionRepository,
  auditRepository,
  cryptoService,
  jwtService,
);

export const registerUseCase = new RegisterUseCase(
  userRepository,
  auditRepository,
  cryptoService,
  mailerService,
  emailVerificationRepository,
);

export const verifyEmailUseCase = new VerifyEmailUseCase(
  userRepository,
  emailVerificationRepository,
  auditRepository,
);

export const resendVerificationUseCase = new ResendVerificationUseCase(
  userRepository,
  emailVerificationRepository,
  mailerService,
  auditRepository,
);

export const getAuditLogsUseCase = new GetAuditLogsUseCase(
  auditRepository,
  userRepository,
);

export const forgotPasswordUseCase = new ForgotPasswordUseCase(
  userRepository,
  passwordResetRepository,
  mailerService,
);

export const resetPasswordUseCase = new ResetPasswordUseCase(
  userRepository,
  passwordResetRepository,
  sessionRepository,
  auditRepository,
  cryptoService,
);

export const dependencies = {
  db,
  userRepository,
  sessionRepository,
  auditRepository,
  passwordResetRepository,
  emailVerificationRepository,
  cryptoService,
  jwtService,
  mailerService,
  getAuditLogsUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  verifyEmailUseCase,
  resendVerificationUseCase,
};
