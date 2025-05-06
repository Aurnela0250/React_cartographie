"use server";

import { AuthError } from "next-auth";

import { Container } from "@/infrastructure/store/container";
import {
    loginSchema,
    newPasswordSchema,
    registerSchema,
    resetPasswordSchema,
} from "@/presentation/schemas/auth.schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/shared/constants/routes";
import {
    AuthResult,
    LoginCredentials,
    NewPasswordData,
    RegisterData,
    ResetPasswordData,
} from "@/shared/types/auth.types";

/**
 * Server action for user login
 * @param credentials - User credentials
 * @returns Login result
 */
export async function login(
    credentials: LoginCredentials
): Promise<AuthResult> {
    // Validate the credentials
    const validatedFields = loginSchema.safeParse(credentials);

    if (!validatedFields.success) {
        return {
            error: "Invalid credentials",
            details: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        // Use NextAuth signIn function
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }

        throw error;
    }
}

/**
 * Server action for user registration
 * @param userData - User registration data
 * @returns Registration result
 */
export async function register(userData: RegisterData): Promise<AuthResult> {
    // Validate the user data
    const validatedFields = registerSchema.safeParse(userData);

    if (!validatedFields.success) {
        return {
            error: "Invalid data",
            details: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const container = Container.getInstance();
        const authUseCase = container.getAuthUseCase();

        // Register the user
        await authUseCase.register(validatedFields.data);

        return { success: true };
    } catch (error: any) {
        console.error("Registration error:", error);

        if (error.message && error.message.includes("already exists")) {
            return { error: "A user with this email already exists" };
        }

        return { error: "Something went wrong during registration" };
    }
}

/**
 * Server action for user logout
 * @returns Logout result
 */
export async function logout(): Promise<AuthResult> {
    try {
        await signOut();

        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);

        return { error: "Something went wrong during logout" };
    }
}

/**
 * Server action for requesting password reset
 * @param data - Password reset request data
 * @returns Password reset request result
 */
export async function resetPassword(
    data: ResetPasswordData
): Promise<AuthResult> {
    // Validate the email
    const validatedFields = resetPasswordSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            error: "Invalid email",
            details: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const container = Container.getInstance();
        const authUseCase = container.getAuthUseCase();

        // Request password reset
        await authUseCase.requestPasswordReset(validatedFields.data.email);

        return { success: true };
    } catch (error) {
        console.error("Password reset request error:", error);

        return { error: "Something went wrong" };
    }
}

/**
 * Server action for setting a new password
 * @param data - New password data
 * @param token - Password reset token
 * @returns New password result
 */
export async function setNewPassword(
    data: NewPasswordData,
    token: string
): Promise<AuthResult> {
    // Validate the new password
    const validatedFields = newPasswordSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            error: "Invalid password",
            details: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const container = Container.getInstance();
        const authUseCase = container.getAuthUseCase();

        // Set new password
        await authUseCase.setNewPassword(validatedFields.data.password, token);

        return { success: true };
    } catch (error) {
        console.error("Set new password error:", error);

        return { error: "Something went wrong" };
    }
}
