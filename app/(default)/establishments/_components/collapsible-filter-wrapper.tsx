"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/presentation/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
} from "@/presentation/components/ui/sidebar";

interface CollapsibleFilterWrapperProps {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

export function CollapsibleFilterWrapper({
    icon,
    title,
    children,
    defaultOpen = false,
}: CollapsibleFilterWrapperProps) {
    return (
        <SidebarGroup>
            <Collapsible
                asChild
                defaultOpen={defaultOpen}
                className="group/collapsible"
            >
                <div>
                    <CollapsibleTrigger asChild>
                        <SidebarGroupLabel className="flex cursor-pointer items-center gap-2">
                            {icon}
                            {title}
                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>{children}</CollapsibleContent>
                </div>
            </Collapsible>
        </SidebarGroup>
    );
}
