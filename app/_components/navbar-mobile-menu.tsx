"use client";

import { ThemeToggle } from "@/presentation/components/features/theme-toggle";
import { Button } from "@/presentation/components/ui/button";
import LogoutButton from "@/app/_components/logout-button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/presentation/components/ui/navigation-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/presentation/components/ui/popover";

interface NavbarMobileMenuProps {
    navigationLinks: Array<{ href: string; label: string }>;
    isLoggedIn: boolean;
    user?: {
        id: number;
        email: string;
        active: boolean;
        isAdmin: boolean;
    } | null;
}

export default function NavbarMobileMenu({
    navigationLinks,
    isLoggedIn,
}: NavbarMobileMenuProps) {


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="group size-8" size="icon" variant="ghost">
                    <svg
                        className="pointer-events-none"
                        fill="none"
                        height={16}
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width={16}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            className="origin-center translate-y-[-7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                            d="M4 12L20 12"
                        />
                        <path
                            className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                            d="M4 12H20"
                        />
                        <path
                            className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                            d="M4 12H20"
                        />
                    </svg>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                    <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                        {navigationLinks.map((link, index) => (
                            <NavigationMenuItem key={index} className="w-full">
                                <NavigationMenuLink
                                    className="py-1.5"
                                    href={link.href}
                                >
                                    {link.label}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}

                        {/* Theme Toggle */}
                        <NavigationMenuItem className="w-full">
                            <div className="flex items-center justify-between py-1.5">
                                <span className="text-sm">Thème</span>
                                <ThemeToggle />
                            </div>
                        </NavigationMenuItem>

                        {!isLoggedIn && (
                            <>
                                <NavigationMenuItem className="w-full">
                                    <NavigationMenuLink
                                        className="py-1.5"
                                        href="/login"
                                    >
                                        Connexion
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="w-full">
                                    <NavigationMenuLink
                                        className="py-1.5"
                                        href="/register"
                                    >
                                        Inscription
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </>
                        )}

                        {isLoggedIn && (
                            <>
                                <NavigationMenuItem className="w-full">
                                    <NavigationMenuLink
                                        className="py-1.5"
                                        href="/profile"
                                    >
                                        Mon profil
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="w-full">
                                    <NavigationMenuLink
                                        className="py-1.5"
                                        href="/favorites"
                                    >
                                        Mes favoris
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="w-full">
                                    <LogoutButton variant="menu-item" showIcon={false} />
                                </NavigationMenuItem>
                            </>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </PopoverContent>
        </Popover>
    );
}
