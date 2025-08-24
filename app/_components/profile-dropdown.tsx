import * as React from "react";
import Link from "next/link";
import { FileText, LogOut, Settings } from "lucide-react";

import { signOutAction } from "@/core/actions/auth/sign-out.action";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import UserAvatar from "@/presentation/components/user-avatar";
import { cn } from "@/shared/utils";
import { User } from "@/src/entities/models/user";
import { ThemeToggle } from "@/presentation/components/features/theme-toggle";

interface MenuItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    external?: boolean;
}

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    user: User;
}

export default function ProfileDropdown({
    user,
    className,
    ...props
}: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const menuItems: MenuItem[] = [
        {
            label: "Settings",
            href: "/settings",
            icon: <Settings className="h-4 w-4" />,
        },
        {
            label: "Terms & Policies",
            href: "/terms",
            icon: <FileText className="h-4 w-4" />,
            external: true,
        },
    ];

    return (
        <div className={cn("relative", className)} {...props}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <div className="group relative">
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                        >
                            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-zinc-900">
                                <UserAvatar
                                    email={user.email}
                                    image={user.picture}
                                />
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={4}
                        className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-accent w-64 origin-top-right rounded-2xl border p-2 shadow-xl shadow-zinc-900/5 backdrop-blur-sm dark:shadow-zinc-950/20"
                    >
                        {/* User Information Section */}
                        <div className="flex items-center gap-3 p-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-zinc-900">
                                    <UserAvatar
                                        email={user.email}
                                        image={user.picture}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm leading-tight font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                                    {user.email.split("@")[0]}
                                </div>
                                <div className="text-xs leading-tight tracking-tight text-zinc-500 dark:text-zinc-400">
                                    {user.email}
                                </div>
                                {user.isAdmin && (
                                    <div className="text-xs leading-tight tracking-tight text-blue-600 dark:text-blue-400">
                                        Administrateur
                                    </div>
                                )}
                            </div>
                        </div>

                        <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

                        <div className="space-y-1">
                            <div className="px-2 py-1">
                                <ThemeToggle />
                            </div>
                            {menuItems.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link
                                        href={item.href}
                                        className="group flex cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-zinc-200/50 hover:bg-zinc-100/80 hover:shadow-sm dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/60"
                                    >
                                        <div className="flex flex-1 items-center gap-2">
                                            {item.icon}
                                            <span className="text-sm leading-tight font-medium tracking-tight whitespace-nowrap text-zinc-900 transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-zinc-50">
                                                {item.label}
                                            </span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>

                        <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

                        <DropdownMenuItem asChild>
                            <form action={signOutAction}>
                                <button
                                    type="submit"
                                    className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-red-500/10 p-3 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/20 hover:shadow-sm"
                                >
                                    <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600" />
                                    <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                                        Déconnexion
                                    </span>
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    );
}
