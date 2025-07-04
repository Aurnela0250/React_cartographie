"use client";

import { useState } from "react";
import { Calendar, Clock, Search, Users } from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";

// Mock data for programs
const mockPrograms = [
    {
        id: "1",
        name: "Licence en Informatique",
        level: "Bac+3",
        duration: "3 ans",
        department: "Informatique",
        admissionRate: "75%",
        startDate: "Septembre 2024",
        description:
            "Formation généraliste en informatique couvrant les fondamentaux de la programmation, des algorithmes, des bases de données et des réseaux.",
        tags: ["Informatique", "Programmation", "Algorithmique"],
    },
    {
        id: "2",
        name: "Master en Intelligence Artificielle",
        level: "Bac+5",
        duration: "2 ans",
        department: "Informatique",
        admissionRate: "40%",
        startDate: "Septembre 2024",
        description:
            "Formation spécialisée en intelligence artificielle, apprentissage automatique, traitement du langage naturel et vision par ordinateur.",
        tags: ["IA", "Machine Learning", "Data Science"],
    },
    {
        id: "3",
        name: "Doctorat en Informatique",
        level: "Bac+8",
        duration: "3 ans",
        department: "Informatique",
        admissionRate: "25%",
        startDate: "Octobre 2024",
        description:
            "Programme de recherche avancée en informatique permettant de contribuer à l'avancement des connaissances dans un domaine spécifique.",
        tags: ["Recherche", "Innovation", "Publication"],
    },
    {
        id: "4",
        name: "Master en Cybersécurité",
        level: "Bac+5",
        duration: "2 ans",
        department: "Informatique",
        admissionRate: "45%",
        startDate: "Septembre 2024",
        description:
            "Formation spécialisée dans la sécurité des systèmes d'information, la cryptographie, l'analyse de vulnérabilités et la réponse aux incidents.",
        tags: ["Sécurité", "Cryptographie", "Ethical Hacking"],
    },
    {
        id: "5",
        name: "Licence en Mathématiques",
        level: "Bac+3",
        duration: "3 ans",
        department: "Mathématiques",
        admissionRate: "70%",
        startDate: "Septembre 2024",
        description:
            "Formation fondamentale en mathématiques pures et appliquées, incluant l'algèbre, l'analyse, les probabilités et les statistiques.",
        tags: ["Mathématiques", "Analyse", "Algèbre"],
    },
    {
        id: "6",
        name: "Master en Science des Données",
        level: "Bac+5",
        duration: "2 ans",
        department: "Mathématiques & Informatique",
        admissionRate: "50%",
        startDate: "Septembre 2024",
        description:
            "Formation interdisciplinaire combinant statistiques, informatique et mathématiques pour l'analyse et l'interprétation des données massives.",
        tags: ["Big Data", "Statistiques", "Visualisation"],
    },
];

interface ProgramsListProps {
    establishmentId: string;
}

export function ProgramsList({ establishmentId }: ProgramsListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const filteredPrograms = mockPrograms.filter((program) => {
        const matchesSearch =
            program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.department
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            program.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (activeTab === "all") return matchesSearch;

        const levelMap: Record<string, string[]> = {
            licence: ["Bac+3"],
            master: ["Bac+5"],
            doctorat: ["Bac+8"],
        };

        return matchesSearch && levelMap[activeTab]?.includes(program.level);
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
                    <Input
                        className="pl-8"
                        placeholder="Rechercher une formation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Tabs
                    className="w-full sm:w-auto"
                    defaultValue="all"
                    onValueChange={setActiveTab}
                >
                    <TabsList>
                        <TabsTrigger value="all">Tous</TabsTrigger>
                        <TabsTrigger value="licence">Licence</TabsTrigger>
                        <TabsTrigger value="master">Master</TabsTrigger>
                        <TabsTrigger value="doctorat">Doctorat</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="space-y-4">
                {filteredPrograms.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        Aucune formation trouvée
                    </div>
                ) : (
                    filteredPrograms.map((program) => (
                        <Card key={program.id}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {program.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {program.department}
                                        </p>
                                    </div>
                                    <Badge>{program.level}</Badge>
                                </div>

                                <p className="mb-4 text-sm text-muted-foreground">
                                    {program.description}
                                </p>

                                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="flex items-center">
                                        <Clock className="text-muted-foreground mr-2 size-4" />
                                        <div className="text-sm">
                                            <p className="font-medium">Durée</p>
                                            <p className="text-muted-foreground">
                                                {program.duration}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="text-muted-foreground mr-2 size-4" />
                                        <div className="text-sm">
                                            <p className="font-medium">
                                                Rentrée
                                            </p>
                                            <p className="text-muted-foreground">
                                                {program.startDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="text-muted-foreground mr-2 size-4" />
                                        <div className="text-sm">
                                            <p className="font-medium">
                                                Admission
                                            </p>
                                            <p className="text-muted-foreground">
                                                {program.admissionRate}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4 flex flex-wrap gap-2">
                                    {program.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            className="text-xs"
                                            variant="secondary"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex justify-end">
                                    <Button>Détails de la formation</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
