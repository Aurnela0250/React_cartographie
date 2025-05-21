"use client";

import * as React from "react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/presentation/components/ui/avatar";
import { Button } from "@/presentation/components/ui/button";
// Remplacer par le bon chemin si besoin
import { MessageLoading } from "@/presentation/components/ui/message-loading";
import { cn } from "@/shared/utils/index";

interface ChatBubbleProps {
    variant?: "sent" | "received";
    layout?: "default" | "ai";
    className?: string;
    children: React.ReactNode;
}

export function ChatBubble({
    variant = "received",
    layout = "default",
    className,
    children,
}: ChatBubbleProps) {
    return (
        <div
            className={cn(
                "mb-4 flex items-start gap-2",
                variant === "sent" && "flex-row-reverse",
                className
            )}
        >
            {children}
        </div>
    );
}

interface ChatBubbleMessageProps {
    variant?: "sent" | "received";
    isLoading?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export function ChatBubbleMessage({
    variant = "received",
    isLoading,
    className,
    children,
}: ChatBubbleMessageProps) {
    return (
        <div
            className={cn(
                "rounded-lg p-3",
                variant === "sent"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
                className
            )}
        >
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <MessageLoading />
                </div>
            ) : (
                children
            )}
        </div>
    );
}

interface ChatBubbleAvatarProps {
    src?: string;
    fallback?: string;
    className?: string;
}

export function ChatBubbleAvatar({
    src,
    fallback = "AI",
    className,
}: ChatBubbleAvatarProps) {
    return (
        <Avatar className={cn("size-8", className)}>
            {src && <AvatarImage src={src} />}
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    );
}

interface ChatBubbleActionProps {
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export function ChatBubbleAction({
    icon,
    onClick,
    className,
}: ChatBubbleActionProps) {
    return (
        <Button
            className={cn("size-6", className)}
            size="icon"
            variant="ghost"
            onClick={onClick}
        >
            {icon}
        </Button>
    );
}

export function ChatBubbleActionWrapper({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn("mt-2 flex items-center gap-1", className)}>
            {children}
        </div>
    );
}
