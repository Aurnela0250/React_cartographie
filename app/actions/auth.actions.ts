"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { loginSchema } from "@/presentation/schemas/auth.schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export type LoginFormState = {
    success?: boolean;
    error?: string;
};

export async function login(
    prevState: LoginFormState,
    formData: FormData
): Promise<LoginFormState> {
    // Validate form data
    const validatedFields = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    // Return validation errors if any
    if (!validatedFields.success) {
        return {
            success: false,
            error: "Champs invalides. Veuillez vérifier vos informations.",
        };
    }

    const { email, password } = validatedFields.data;

    try {
        // Attempt to sign in with credentials
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });

        // This won't be reached if redirectTo is set, as signIn will redirect
        return { success: true };
    } catch (error) {
        // Handle authentication errors
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        success: false,
                        error: "Email ou mot de passe incorrect",
                    };
                default:
                    return {
                        success: false,
                        error: "Une erreur est survenue lors de la connexion",
                    };
            }
        }

        // Handle unexpected errors
        return { success: false, error: "Une erreur inattendue est survenue" };
    }
}
