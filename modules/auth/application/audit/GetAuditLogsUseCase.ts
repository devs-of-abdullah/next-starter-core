import {
  IAuditRepository,
  IUserRepository,
} from "@/modules/auth/domain/interfaces/IRepositories";

export class GetAuditLogsUseCase {
  constructor(
    private auditRepository: IAuditRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(userId?: string) {
    if (!userId) {
      return this.auditRepository.findAll();
    }

    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.role === "ADMIN") {
      return this.auditRepository.findAll();
    }

    return this.auditRepository.findManyByUserId(userId);
  }
}
