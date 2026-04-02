import bcrypt from "bcrypt";
import { ICryptoService } from "@/modules/auth/domain/interfaces/IServices";

export class BcryptCryptoService implements ICryptoService {
  async hash(data: string, saltOrRounds: number = 12): Promise<string> {
    return bcrypt.hash(data, saltOrRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
