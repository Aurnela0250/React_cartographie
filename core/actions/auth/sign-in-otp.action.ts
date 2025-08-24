"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { DEFAULT_LOGIN_REDIRECT } from "@/core/constants/route";
import { getInjection } from "@/di/container";
import { UnauthenticatedError } from "@/src/entities/errors/auth";

const signInOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(6, "OTP must be 6 digits"),
});

export const signInOtpAction = async (formData: FormData) => {
    try {
        const email = formData.get("email") as string;
        const otp = formData.get("otp") as string;
        const redirectTo = formData.get("redirectTo") as string | null;

        const validation = signInOtpSchema.safeParse({ email, otp });
        if (!validation.success) {
            return {
                error:
                    validation.error.errors[0]?.message ?? "Code OTP invalide",
            };
        }

        const signInOtpController = getInjection("ISignInOtpController");
        const result = await signInOtpController({ email, otp });

        const cookieStore = await cookies();
        // access token
        cookieStore.set(
            result.accessTokenCookie.name,
            result.accessTokenCookie.value,
            {
                secure: result.accessTokenCookie.attributes.secure,
                path: result.accessTokenCookie.attributes.path,
                domain: result.accessTokenCookie.attributes.domain,
                sameSite: result.accessTokenCookie.attributes.sameSite,
                httpOnly: result.accessTokenCookie.attributes.httpOnly,
                maxAge: result.accessTokenCookie.attributes.maxAge,
                expires: result.accessTokenCookie.attributes.expires,
            }
        );

        // refresh token
        cookieStore.set(
            result.refreshTokenCookie.name,
            result.refreshTokenCookie.value,
            {
                secure: result.refreshTokenCookie.attributes.secure,
                path: result.refreshTokenCookie.attributes.path,
                domain: result.refreshTokenCookie.attributes.domain,
                sameSite: result.refreshTokenCookie.attributes.sameSite,
                httpOnly: result.refreshTokenCookie.attributes.httpOnly,
                maxAge: result.refreshTokenCookie.attributes.maxAge,
                expires: result.refreshTokenCookie.attributes.expires,
            }
        );

        // user
        cookieStore.set(result.userCookie.name, result.userCookie.value, {
            secure: result.userCookie.attributes.secure,
            path: result.userCookie.attributes.path,
            domain: result.userCookie.attributes.domain,
            sameSite: result.userCookie.attributes.sameSite,
            httpOnly: result.userCookie.attributes.httpOnly,
            maxAge: result.userCookie.attributes.maxAge,
            expires: result.userCookie.attributes.expires,
        });

        const path = redirectTo || DEFAULT_LOGIN_REDIRECT;
        redirect(path);
    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        if (error instanceof UnauthenticatedError) {
            return { error: "Code OTP incorrect" };
        }
        if (error instanceof z.ZodError) {
            return { error: error.errors[0]?.message || "Code OTP invalide" };
        }
        return {
            error: "Une erreur est survenue lors de la connexion par OTP",
        };
    }
};
