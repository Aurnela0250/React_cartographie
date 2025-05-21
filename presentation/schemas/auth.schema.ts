import { z } from "zod";

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
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
            message: "Email is required",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters",
        }),
        confirmPassword: z.string().min(1, {
            message: "Confirm password is required",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

/**
 * Password reset request validation schema
 */
export const resetPasswordSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

/**
 * New password validation schema
 */
export const newPasswordSchema = z
    .object({
        password: z.string().min(8, {
            message: "Password must be at least 8 characters",
        }),
        confirmPassword: z.string().min(1, {
            message: "Confirm password is required",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
