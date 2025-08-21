import Link from "next/link";
import { Menu } from "lucide-react";

import { auth } from "@/lib/auth";
import { Button } from "@/presentation/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/presentation/components/ui/sheet";

import NavbarUserMenu from "@/app/_components/navbar-user-menu";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Établissements", href: "/establishments" },
    { name: "Carte", href: "/map" },
];

interface MobileMenuContentProps {
    navigation: Array<{ name: string; href: string }>;
    session: any;
}

function MobileMenuContent({ navigation, session }: MobileMenuContentProps) {
    return (
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex items-center justify-between">
                <Link className="-m-1.5 p-1.5" href="/">
                    <span className="sr-only">Orientation Mada</span>
                    <div className="text-xl font-bold text-primary">
                        Orientation Mada
                    </div>
                </Link>
            </div>
            <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-border">
                    <div className="space-y-2 py-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-accent"
                                href={item.href}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="py-6 space-y-2">
                        <div className="-mx-3 flex items-center justify-between py-2">
                            <span className="text-base font-semibold">Thème</span>
                            <ThemeToggle />
                        </div>
                        
                        {!session?.user && (
                            <>
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="-mx-3 w-full justify-start rounded-lg px-3 py-2.5 text-base font-semibold"
                                >
                                    <Link href="/login">Connexion</Link>
                                </Button>
                                <Button
                                    asChild
                                    className="-mx-3 w-full justify-start rounded-lg px-3 py-2.5 text-base font-semibold"
                                >
                                    <Link href="/register">Inscription</Link>
                                </Button>
                            </>
                        )}
                        
                        {session?.user && (
                            <div className="-mx-3 py-2">
                                <NavbarUserMenu />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SheetContent>
    );
}

export default async function Navbar() {
    const session = await auth();
    
    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <nav
                aria-label="Global"
                className="flex items-center justify-between p-6 lg:px-8"
            >
                <div className="flex lg:flex-1">
                    <Link className="-m-1.5 p-1.5" href="/">
                        <span className="sr-only">Orientation Mada</span>
                        <div className="text-xl font-bold text-primary">
                            Orientation Mada
                        </div>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="-m-2.5 p-2.5 text-foreground"
                            >
                                <span className="sr-only">Open main menu</span>
                                <Menu aria-hidden="true" className="size-6" />
                            </Button>
                        </SheetTrigger>
                        <MobileMenuContent
                            navigation={navigation}
                            session={session}
                        />
                    </Sheet>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                            href={item.href}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-2">
                    <ThemeToggle />
                    
                    {!session?.user && (
                        <>
                            <Button
                                asChild
                                variant="secondary"
                                size="sm"
                                className="text-sm font-semibold"
                            >
                                <Link href="/login">
                                    Connexion
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                className="text-sm font-semibold"
                            >
                                <Link href="/register">
                                    Inscription
                                </Link>
                            </Button>
                        </>
                    )}

                    {session?.user && <NavbarUserMenu />}
                </div>
            </nav>
        </header>
    );
}