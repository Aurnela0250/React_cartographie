"use client";

import { Building, Filter, GraduationCap, MapPin } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Separator } from "@/presentation/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";

interface EstablishmentsFilterSidebarProps {
    className?: string;
}

export function EstablishmentsFilterSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    // Mock data for filters - will be replaced with real data later
    const cities = [
        { id: "1", name: "Paris", count: 45 },
        { id: "2", name: "Lyon", count: 23 },
        { id: "3", name: "Marseille", count: 18 },
        { id: "4", name: "Toulouse", count: 15 },
        { id: "5", name: "Nice", count: 12 },
    ];

    const domains = [
        { id: "1", name: "Informatique", count: 67 },
        { id: "2", name: "Commerce", count: 34 },
        { id: "3", name: "Ingénierie", count: 28 },
        { id: "4", name: "Santé", count: 22 },
        { id: "5", name: "Arts", count: 15 },
    ];

    const levels = [
        { id: "1", name: "Licence", count: 89 },
        { id: "2", name: "Master", count: 76 },
        { id: "3", name: "Doctorat", count: 23 },
        { id: "4", name: "BTS", count: 45 },
        { id: "5", name: "DUT", count: 32 },
    ];

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="border-b">
                <div className="flex items-center gap-2 px-4 py-2">
                    <Filter className="size-5" />
                    <h2 className="text-lg font-semibold">Filtres</h2>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Search Filter */}
                <SidebarGroup>
                    <SidebarGroupLabel>Recherche</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="px-3">
                            <Input
                                placeholder="Rechercher un établissement..."
                                className="w-full"
                            />
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator />

                {/* Cities Filter */}
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        Villes
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {cities.map((city) => (
                                <SidebarMenuItem key={city.id}>
                                    <SidebarMenuButton asChild>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`city-${city.id}`}
                                                />
                                                <Label
                                                    htmlFor={`city-${city.id}`}
                                                    className="cursor-pointer text-sm font-normal"
                                                >
                                                    {city.name}
                                                </Label>
                                            </div>
                                            <span className="text-muted-foreground text-xs">
                                                {city.count}
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator />

                {/* Domains Filter */}
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-2">
                        <Building className="size-4" />
                        Domaines
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {domains.map((domain) => (
                                <SidebarMenuItem key={domain.id}>
                                    <SidebarMenuButton asChild>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`domain-${domain.id}`}
                                                />
                                                <Label
                                                    htmlFor={`domain-${domain.id}`}
                                                    className="cursor-pointer text-sm font-normal"
                                                >
                                                    {domain.name}
                                                </Label>
                                            </div>
                                            <span className="text-muted-foreground text-xs">
                                                {domain.count}
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator />

                {/* Levels Filter */}
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-2">
                        <GraduationCap className="size-4" />
                        Niveaux
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {levels.map((level) => (
                                <SidebarMenuItem key={level.id}>
                                    <SidebarMenuButton asChild>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`level-${level.id}`}
                                                />
                                                <Label
                                                    htmlFor={`level-${level.id}`}
                                                    className="cursor-pointer text-sm font-normal"
                                                >
                                                    {level.name}
                                                </Label>
                                            </div>
                                            <span className="text-muted-foreground text-xs">
                                                {level.count}
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator />

                {/* Filter Actions */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <div className="flex flex-col gap-2 px-3">
                            <Button className="w-full">
                                Appliquer les filtres
                            </Button>
                            <Button variant="outline" className="w-full">
                                Réinitialiser
                            </Button>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
