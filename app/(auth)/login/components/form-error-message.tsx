"use client";

import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface FormErrorProps {
    message?: string | null;
}

export function FormError({ message }: FormErrorProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(!!message);
    }, [message]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 w-full"
                    exit={{ opacity: 0, y: -10 }}
                    initial={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <div className="rounded-lg bg-destructive/10 px-4 py-3 text-destructive">
                        <div className="flex items-end gap-3">
                            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                            <div className="grow">
                                <p className="text-sm font-medium">
                                    {message || "Une erreur est survenue"}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
