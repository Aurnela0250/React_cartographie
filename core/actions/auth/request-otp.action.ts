"use server";

import { z } from "zod";

import { getInjection } from "@/di/container";

const requestOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const requestOtpAction = async (
    formData: FormData
): Promise<{
    message: string;
    expiresInMinutes: number;
}> => {
    try {
        const data = requestOtpSchema.parse({
            email: formData.get("email"),
        });

        const requestOtpController = getInjection("IRequestOtpController");

        const result = await requestOtpController({ email: data.email });

        return result;
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.errors[0]?.message || "Invalid input");
        }

        throw new Error("Failed to send OTP. Please try again.");
    }
};
