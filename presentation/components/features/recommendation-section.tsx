"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, MapPin, Sparkles } from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/presentation/components/ui/tabs";

// Mock data for recommendations
const recommendedEstablishments = [
    {
        id: "1",
        name: "Université d'Antananarivo",
        type: "Université",
        location: "Ankatso, Antananarivo",
        match: 95,
        programs: ["Informatique", "Physique", "Biologie"],
    },
    {
        id: "2",
        name: "École Polytechnique",
        type: "Grande École",
        location: "Vontovorona, Anatananarivo",
        match: 92,
        programs: ["Mathématiques", "Physique", "Informatique"],
    },
    {
        id: "3",
        name: "ESMIA ",
        type: "Université",
        location: "Mahamasina, Antananarivo",
        match: 88,
        programs: ["Génie électrique", "Informatique", "Télécommunications"],
    },
];

const recommendedPrograms = [
    {
        id: "1",
        name: "Master en Intelligence Artificielle",
        establishment: "Université d'Antananarivo",
        level: "Bac+5",
        match: 97,
    },
    {
        id: "2",
        name: "Licence en Informatique",
        establishment: "École Polytechnique",
        level: "Bac+3",
        match: 94,
    },
    {
        id: "3",
        name: "Diplôme d'Ingénieur",
        establishment: "ESMIA",
        level: "Bac+5",
        match: 91,
    },
];

export function RecommendationSection() {
    const [activeTab, setActiveTab] = useState("establishments");

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Sparkles className="text-primary size-5" />
                    <CardTitle>Recommandations IA</CardTitle>
                </div>
                <CardDescription>
                    Suggestions personnalisées basées sur votre profil
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs
                    defaultValue="establishments"
                    onValueChange={setActiveTab}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="establishments">
                            Établissements
                        </TabsTrigger>
                        <TabsTrigger value="programs">Formations</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        className="mt-4 space-y-4"
                        value="establishments"
                    >
                        {recommendedEstablishments.map((establishment) => (
                            <div
                                key={establishment.id}
                                className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                                <div className="mb-1 flex items-start justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            {establishment.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="size-3" />
                                            <span>
                                                {establishment.location}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge
                                        className="bg-primary/10"
                                        variant="secondary"
                                    >
                                        {establishment.match}% match
                                    </Badge>
                                </div>
                                <div className="mb-3 mt-2 flex flex-wrap gap-1">
                                    {establishment.programs.map((program) => (
                                        <Badge
                                            key={program}
                                            className="text-xs"
                                            variant="outline"
                                        >
                                            {program}
                                        </Badge>
                                    ))}
                                </div>
                                <Button
                                    asChild
                                    className="w-full"
                                    size="sm"
                                    variant="outline"
                                >
                                    <Link
                                        href={`/establishments/${establishment.id}`}
                                    >
                                        Voir l'établissement
                                    </Link>
                                </Button>
                            </div>
                        ))}
                        <Button asChild className="w-full">
                            <Link href="/recommendations">
                                Voir toutes les recommandations
                            </Link>
                        </Button>
                    </TabsContent>
                    <TabsContent className="mt-4 space-y-4" value="programs">
                        {recommendedPrograms.map((program) => (
                            <div
                                key={program.id}
                                className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                                <div className="mb-1 flex items-start justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            {program.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <BookOpen className="size-3" />
                                            <span>{program.establishment}</span>
                                        </div>
                                    </div>
                                    <Badge
                                        className="bg-primary/10"
                                        variant="secondary"
                                    >
                                        {program.match}% match
                                    </Badge>
                                </div>
                                <div className="mb-3 mt-2 flex items-center gap-1">
                                    <GraduationCap className="text-muted-foreground size-3" />
                                    <span className="text-sm text-muted-foreground">
                                        {program.level}
                                    </span>
                                </div>
                                <Button
                                    className="w-full"
                                    size="sm"
                                    variant="outline"
                                >
                                    Voir la formation
                                </Button>
                            </div>
                        ))}
                        <Button asChild className="w-full">
                            <Link href="/recommendations">
                                Voir toutes les recommandations
                            </Link>
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
