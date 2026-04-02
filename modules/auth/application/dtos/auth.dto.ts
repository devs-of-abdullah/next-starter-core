import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

// Used at the API boundary (no confirmPassword — that's UI-only)
export const ApiRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type ApiRegisterDTO = z.infer<typeof ApiRegisterSchema>;

// Full form DTO (used in client-side form validation)
export const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;
