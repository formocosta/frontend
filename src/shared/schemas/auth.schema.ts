import { z } from "zod";

export const signinSchema = z.object({
    email: z
        .string()
        .min(1, "Email é obrigatório")
        .email("Email inválido"),
    password: z
        .string()
        .min(1, "Palavra-passe é obrigatória"),
});

export type SigninFormData = z.infer<typeof signinSchema>;

export const signupSchema = z.object({
    nome: z
        .string()
        .min(1, "Nome é obrigatório"),
    telefone: z
        .string()
        .min(1, "Telefone é obrigatório"),
    email: z
        .string()
        .min(1, "Email é obrigatório")
        .email("Email inválido"),
    senha: z
        .string()
        .min(8, "A palavra-passe deve ter pelo menos 8 caracteres"),
    confirmarSenha: z
        .string()
        .min(1, "Confirmação de palavra-passe é obrigatória"),
    tipoConta: z.enum(["cliente", "prestador"]),
    aceitouTermos: z.literal(true, {
        message: "Você precisa aceitar os termos",
    }),
}).refine((data) => data.senha === data.confirmarSenha, {
    message: "As palavras-passe não coincidem",
    path: ["confirmarSenha"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const verifyOtpSchema = z.object({
    telefone: z.string().min(1, "Telefone é obrigatório"),
    codigo: z.string().length(6, "O código deve ter 6 dígitos"),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
