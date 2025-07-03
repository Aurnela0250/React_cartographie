"use client";

import { useCallback, useRef } from "react";
import { Edit, Trash } from "lucide-react";

import { EstablishmentType } from "@/core/entities/establishment-type.entity";
import { PaginatedResult } from "@/core/entities/pagination";
import { Button } from "@/presentation/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/presentation/components/ui/table";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useEstablishmentTypeStore } from "./establishment-type-store";

export function EstablishmentTypeList() {
    const {
        setSelectedEstablishmentType,
        setIsAddEditDialogOpen,
        setIsDeleteDialogOpen,
        setFormError,
    } = useEstablishmentTypeStore();

    const fetchEstablishmentTypes = async ({
        pageParam = 1,
    }): Promise<PaginatedResult<EstablishmentType>> => {
        const res = await fetch(
            `/api/establishment-types?page=${pageParam}&per_page=5`
        );

        return res.json();
    };
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["establishment-types"],
            queryFn: fetchEstablishmentTypes,
            getNextPageParam: (lastPage: PaginatedResult<EstablishmentType>) =>
                lastPage.nextPage ? lastPage.nextPage : undefined,
            initialPageParam: 1,
        });
    const observer = useRef<IntersectionObserver | null>(null);
    const lastEstablishmentTypeRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage]
    );

    const handleEdit = (establishmentType: EstablishmentType) => {
        setFormError(null);
        setSelectedEstablishmentType(establishmentType);
        setIsAddEditDialogOpen(true);
    };

    const handleDelete = (establishmentType: EstablishmentType) => {
        setFormError(null);
        setSelectedEstablishmentType(establishmentType);
        setIsDeleteDialogOpen(true);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.pages.map((page, i) =>
                    page.items.map(
                        (establishmentType: EstablishmentType, idx: number) => {
                            const isLast =
                                i === data.pages.length - 1 &&
                                idx === page.items.length - 1;

                            return (
                                <TableRow
                                    key={establishmentType.id}
                                    ref={
                                        isLast
                                            ? lastEstablishmentTypeRef
                                            : undefined
                                    }
                                >
                                    <TableCell className="font-bold">
                                        {establishmentType.name}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500">
                                        {establishmentType.description}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() =>
                                                    handleEdit(
                                                        establishmentType
                                                    )
                                                }
                                            >
                                                <Edit className="size-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() =>
                                                    handleDelete(
                                                        establishmentType
                                                    )
                                                }
                                            >
                                                <Trash className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        }
                    )
                )}
                {isFetchingNextPage && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">
                            Chargement...
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
