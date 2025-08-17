"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQueryState, parseAsArrayOf, parseAsInteger } from "nuqs";

import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Label } from "@/presentation/components/ui/label";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";

import type { FilterOption } from "./filter-types";

interface DomainsFilterClientProps {
  options: FilterOption[];
}

export function DomainsFilterClient({ options }: DomainsFilterClientProps) {
  const [selectedIds] = useQueryState(
    "domains",
    parseAsArrayOf(parseAsInteger)
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSet = useMemo(() => new Set(selectedIds ?? []), [selectedIds]);

  const buildHref = (id: number) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);

    const nextArray = Array.from(next);
    const params = new URLSearchParams(searchParams?.toString());
    // Reset pagination and drop perPage on filter change
    params.set("page", "1");
    params.delete("perPage");
    if (nextArray.length === 0) {
      params.delete("domains");
    } else {
      params.set("domains", nextArray.join(","));
    }
    const qs = params.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  };

  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {options.map((domain) => {
          const checked = selectedSet.has(domain.id);
          const inputId = `domain-${domain.id}`;
          return (
            <SidebarMenuItem key={domain.id}>
              <SidebarMenuButton asChild>
                <Link href={buildHref(domain.id)} replace>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id={inputId} checked={checked} className="pointer-events-none" />
                      <Label htmlFor={inputId} className="cursor-pointer text-sm font-normal">
                        {domain.name}
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

