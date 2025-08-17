"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";

import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Label } from "@/presentation/components/ui/label";
import {
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";

import type { FilterOption } from "./filter-types";

interface LevelsFilterClientProps {
    options: FilterOption[];
}

export function LevelsFilterClient({ options }: LevelsFilterClientProps) {
    const [selectedIds] = useQueryState(
        "levels",
        parseAsArrayOf(parseAsInteger)
    );
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedSet = useMemo(
        () => new Set(selectedIds ?? []),
        [selectedIds]
    );

    const buildHref = (id: number) => {
        const next = new Set(selectedSet);
        if (next.has(id)) next.delete(id);
        else next.add(id);

        const nextArray = Array.from(next);
        const params = new URLSearchParams(searchParams?.toString());
        // Reset to first page and drop perPage on filter change
        params.set("page", "1");
        params.delete("perPage");
        if (nextArray.length === 0) {
            params.delete("levels");
        } else {
            params.set("levels", nextArray.join(","));
        }
        const qs = params.toString();
        return `${pathname}${qs ? `?${qs}` : ""}`;
    };

    return (
        <SidebarGroupContent>
            <SidebarMenu>
                {options.map((level) => {
                    const checked = selectedSet.has(level.id);
                    const inputId = `level-${level.id}`;
                    return (
                        <SidebarMenuItem key={level.id}>
                            <SidebarMenuButton asChild>
                                <Link href={buildHref(level.id)} replace>
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={inputId}
                                                checked={checked}
                                                className="pointer-events-none"
                                            />
                                            <Label
                                                htmlFor={inputId}
                                                className="cursor-pointer text-sm font-normal"
                                            >
                                                {level.name}
                                            </Label>
                                        </div>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroupContent>
    );
}
