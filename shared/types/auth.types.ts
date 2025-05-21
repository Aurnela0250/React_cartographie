import { z } from "zod";

import { User } from "@/core/entities/users.entity";
import {
    loginSchema,
    newPasswordSchema,
    registerSchema,
    resetPasswordSchema,
    userLoggedSchema,
} from "@/presentation/schemas/auth.schema";

/**
 * Type for login credentials
 */
export type LoginCredentials = z.infer<typeof loginSchema>;

/**
 * Type for user logged in response
 */
export type UserLogged = z.infer<typeof userLoggedSchema>;

/**
 * Type for registration data
 */
export type RegisterData = z.infer<typeof registerSchema>;

/**
 * Type for password reset request
 */
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

/**
 * Type for new password data
 */
export type NewPasswordData = z.infer<typeof newPasswordSchema>;

/**
 * Type for authentication result
 */
export type AuthResult = {
    success?: boolean;
    error?: string;
    details?: Record<string, string[]>;
};

/**
 * Extended user type with tokens
 */
export type AuthUser = User & {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
};

/**
 * Type for JWT token
 */
export type JWTToken = {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    accessTokenExpires?: number;
    error?: string;
};

/**
 * Type for session data
 */
export type SessionData = {
    user: {
        id: string;
        name: string;
        email: string;
        role?: string;
    };
    accessToken: string;
    refreshToken: string;
    token_type: string;
    expires: string;
    error?: string;
};
