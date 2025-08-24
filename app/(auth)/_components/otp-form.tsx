"use client";

import { useEffect, useRef, useState } from "react";
import { OTPInput, SlotProps } from "input-otp";

import { requestOtpAction } from "@/core/actions/auth/request-otp.action";
import { signInOtpAction } from "@/core/actions/auth/sign-in-otp.action";
import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { cn } from "@/shared/lib/utils";

interface OtpFormProps {
    isOpen: boolean;
    onOpenChangeAction: (open: boolean) => void;
    userEmail: string;
}

export default function OtpForm({
    isOpen,
    onOpenChangeAction,
    userEmail,
}: OtpFormProps) {
    const [value, setValue] = useState("");
    const [hasGuessed, setHasGuessed] = useState<undefined | boolean>(
        undefined
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [resendCountdown, setResendCountdown] = useState(30);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [timerSeed, setTimerSeed] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (hasGuessed) {
            closeButtonRef.current?.focus();
        }
    }, [hasGuessed]);

    // Reset and start countdown when dialog opens or when timerSeed changes (e.g., on resend)
    useEffect(() => {
        if (!isOpen) return;
        setResendCountdown(30);
        setResendMessage(null);
        let id = setInterval(() => {
            setResendCountdown((s) => {
                if (s <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [isOpen, timerSeed]);

    async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault?.();

        inputRef.current?.select();
        await new Promise((r) => setTimeout(r, 1_00));

        // Attempt real sign-in via server action; will redirect on success
        setIsSubmitting(true);
        try {
            setSubmitError(null);
            const fd = new FormData();
            fd.append("email", userEmail);
            fd.append("otp", value);
            const res = await signInOtpAction(fd);
            if (res && typeof res === "object" && "error" in (res as any)) {
                setHasGuessed(false);
                setSubmitError((res as any).error as string);
            }
            // On success, Next.js redirect occurs and code below won't run
        } catch (err) {
            // Allow Next.js redirect errors to bubble for navigation
            if (err && typeof err === "object" && "digest" in (err as any)) {
                throw err as any;
            }
            const msg =
                err instanceof Error
                    ? err.message
                    : "Failed to sign in with OTP.";
            setHasGuessed(false);
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }

        setValue("");
        setTimeout(() => {
            inputRef.current?.blur();
        }, 20);
    }

    async function handleResend() {
        if (resendCountdown > 0 || isResending || isSubmitting) return;
        setIsResending(true);
        setResendMessage(null);
        try {
            const fd = new FormData();
            fd.append("email", userEmail);
            const res = await requestOtpAction(fd);
            setResendMessage(res.message);
            setTimerSeed((n) => n + 1);
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Failed to resend code.";
            setResendMessage(msg);
        } finally {
            setIsResending(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChangeAction}>
            <DialogContent>
                <div className="flex flex-col items-center gap-2">
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">
                            {hasGuessed
                                ? "Code vérifié!"
                                : "Entrez le code de confirmation"}
                        </DialogTitle>
                        <DialogDescription className="sm:text-center">
                            {hasGuessed
                                ? "Votre code a été vérifié avec succès."
                                : `Vérifiez votre email (${userEmail}) et entrez le code`}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {hasGuessed ? (
                    <div className="text-center">
                        <DialogClose asChild>
                            <Button type="button" ref={closeButtonRef}>
                                Fermer
                            </Button>
                        </DialogClose>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <OTPInput
                                id="cofirmation-code"
                                ref={inputRef}
                                value={value}
                                onChange={setValue}
                                containerClassName="flex items-center gap-3 has-disabled:opacity-50"
                                maxLength={6}
                                disabled={isSubmitting}
                                onFocus={() => setHasGuessed(undefined)}
                                render={({ slots }) => (
                                    <div className="flex gap-2">
                                        {slots.map((slot, idx) => (
                                            <Slot key={idx} {...slot} />
                                        ))}
                                    </div>
                                )}
                                onComplete={onSubmit}
                            />
                        </div>
                        {hasGuessed === false && (
                            <p
                                className="text-muted-foreground text-center text-xs"
                                role="alert"
                                aria-live="polite"
                            >
                                Code invalide. Veuillez réessayer.
                            </p>
                        )}
                        {submitError && (
                            <p
                                className="text-destructive text-center text-xs"
                                role="alert"
                                aria-live="polite"
                            >
                                {submitError}
                            </p>
                        )}
                        <div className="flex flex-col items-center gap-1 text-center text-sm">
                            <span className="text-muted-foreground">
                                Code non reçu ?
                            </span>
                            <Button
                                type="button"
                                variant="link"
                                onClick={handleResend}
                                disabled={resendCountdown > 0 || isResending || isSubmitting}
                                aria-live="polite"
                            >
                                {resendCountdown > 0
                                    ? `Renvoyer dans ${resendCountdown}s`
                                    : "Renvoyer le code"}
                            </Button>
                            {resendMessage && (
                                <p
                                    className="text-xs text-green-600"
                                    role="status"
                                    aria-live="polite"
                                >
                                    {resendMessage}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function Slot(props: SlotProps) {
    return (
        <div
            className={cn(
                "border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs transition-[color,box-shadow]",
                { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
            )}
        >
            {props.char !== null && <div>{props.char}</div>}
        </div>
    );
}
