export interface ICryptoService {
  hash(data: string, saltOrRounds?: number): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
}

export interface IJwtService {
  signToken(payload: object, options?: { expiresIn?: string | number }): Promise<string>;
  verifyToken<T>(token: string): Promise<T | null>;
  signRefreshToken(
    payload: object,
    options?: { expiresIn?: string | number },
  ): Promise<string>;
  verifyRefreshToken<T>(token: string): Promise<T | null>;
}

export interface IMailerService {
  sendVerificationEmail(
    to: string,
    token: string,
    userId: string,
  ): Promise<void>;
  sendPasswordResetEmail(to: string, token: string): Promise<void>;
}
