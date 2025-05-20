import * as React from "react";

import { Textarea } from "@/presentation/components/ui/textarea";
import { cn } from "@/shared/utils/index";

// No need for a separate interface, use the type directly
const ChatInput = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
    <Textarea
        ref={ref}
        autoComplete="off"
        className={cn(
            "flex h-16 max-h-12 w-full resize-none items-center rounded-md bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        name="message"
        {...props}
    />
));

ChatInput.displayName = "ChatInput";

export { ChatInput };
