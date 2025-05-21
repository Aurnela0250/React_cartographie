import * as React from "react";
import { ArrowDown } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { useAutoScroll } from "@/presentation/hooks/features/chat/use-auto-scroll";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
    smooth?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
    ({ className, children, smooth = false, ...props }, _ref) => {
        const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } =
            useAutoScroll({
                smooth,
                content: children,
            });

        return (
            <div className="relative size-full">
                <div
                    ref={scrollRef}
                    className={`flex size-full flex-col overflow-y-auto p-4 ${className}`}
                    onTouchMove={disableAutoScroll}
                    onWheel={disableAutoScroll}
                    {...props}
                >
                    <div className="flex flex-col gap-6">{children}</div>
                </div>

                {!isAtBottom && (
                    <Button
                        aria-label="Scroll to bottom"
                        className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 rounded-full shadow-md"
                        size="icon"
                        variant="outline"
                        onClick={() => {
                            scrollToBottom();
                        }}
                    >
                        <ArrowDown className="size-4" />
                    </Button>
                )}
            </div>
        );
    }
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
