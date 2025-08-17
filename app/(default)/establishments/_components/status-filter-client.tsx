"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Label } from "@/presentation/components/ui/label";
import {
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";

const STATUS_OPTIONS = [
    { code: "pv", label: "Privé" },
    { code: "pb", label: "Public" },
    { code: "sp", label: "Semi privé" },
] as const;

export function StatusFilterClient() {
    const [selected] = useQueryState(
        "legalStatuses",
        parseAsArrayOf(parseAsString)
    );
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedSet = useMemo(() => new Set(selected ?? []), [selected]);

    const buildHref = (code: string) => {
        const next = new Set(selectedSet);
        if (next.has(code)) next.delete(code);
        else next.add(code);

        const nextArray = Array.from(next);
        const params = new URLSearchParams(searchParams?.toString());
        // Reset to first page and drop perPage on filter change
        params.set("page", "1");
        params.delete("perPage");
        if (nextArray.length === 0) {
            params.delete("legalStatuses");
        } else {
            params.set("legalStatuses", nextArray.join(","));
        }
        const qs = params.toString();
        return `${pathname}${qs ? `?${qs}` : ""}`;
    };

    return (
        <SidebarGroupContent>
            <SidebarMenu>
                {STATUS_OPTIONS.map((opt) => {
                    const checked = selectedSet.has(opt.code);
                    const inputId = `status-${opt.code}`;
                    return (
                        <SidebarMenuItem key={opt.code}>
                            <SidebarMenuButton asChild>
                                <Link href={buildHref(opt.code)} replace>
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
                                                {opt.label}
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
