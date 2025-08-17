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

interface CitiesFilterClientProps {
    options: FilterOption[];
}

export function CitiesFilterClient({ options }: CitiesFilterClientProps) {
    const [selectedIds] = useQueryState(
        "cities",
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
        // Reset pagination when filters change
        params.set("page", "1");
        // Do not keep custom perPage when changing filters
        params.delete("perPage");
        if (nextArray.length === 0) {
            params.delete("cities");
        } else {
            params.set("cities", nextArray.join(","));
        }
        const qs = params.toString();
        return `${pathname}${qs ? `?${qs}` : ""}`;
    };

    return (
        <SidebarGroupContent>
            <SidebarMenu>
                {options.map((city) => {
                    const checked = selectedSet.has(city.id);
                    const inputId = `city-${city.id}`;
                    return (
                        <SidebarMenuItem key={city.id}>
                            <SidebarMenuButton asChild>
                                <Link href={buildHref(city.id)} replace>
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
                                                {city.name}
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
