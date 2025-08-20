import { z } from "zod";

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
    email: z.string().email({
        message: "Veuillez saisir une adresse e-mail valide.",
    }),
    password: z.string().min(1, {
        message: "Veuillez saisir un mot de passe.",
    }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const AccessTokenSchema = z.object({
    access_token: z.string(),
    expires_in: z.number(),
});

export const RefreshTokenSchema = z.object({
    refresh_token: z.string(),
    expires_in: z.number(),
});

/**
 * User logged in response schema
 */
export const userLoggedSchema = z.object({
    access_token: AccessTokenSchema,
    refresh_token: RefreshTokenSchema,
    token_type: z.string(),
    iat: z.string(),
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type UserLogged = z.infer<typeof userLoggedSchema>;

/**
 * Registration form validation schema
 */
export const registerSchema = z
    .object({
        email: z.string().email({
            message: "Veuillez saisir une adresse e-mail valide.",
        }),
        password: z.string().min(8, {
            message: "Le mot de passe doit contenir au moins 8 caractères.",
        }),
        confirmPassword: z.string().min(1, {
            message: "Veuillez confirmer votre mot de passe.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
    });

/**
 * Password reset request validation schema
 */
export const resetPasswordSchema = z.object({
    email: z.string().email({
        message: "Veuillez saisir une adresse e-mail valide.",
    }),
});

/**
 * New password validation schema
 */
export const newPasswordSchema = z
    .object({
        password: z.string().min(8, {
            message: "Le mot de passe doit contenir au moins 8 caractères.",
        }),
        confirmPassword: z.string().min(1, {
            message: "Veuillez confirmer votre mot de passe.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
    });
