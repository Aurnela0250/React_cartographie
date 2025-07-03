"use client";

import { create } from "zustand";

import { EstablishmentType } from "@/core/entities/establishment-type.entity";

interface EstablishmentTypeState {
    selectedEstablishmentType: EstablishmentType | null;
    isAddEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    formError: string | null;
    setSelectedEstablishmentType: (
        establishmentType: EstablishmentType | null
    ) => void;
    setIsAddEditDialogOpen: (open: boolean) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
    setFormError: (error: string | null) => void;
}

export const useEstablishmentTypeStore = create<EstablishmentTypeState>(
    (set) => ({
        selectedEstablishmentType: null,
        isAddEditDialogOpen: false,
        isDeleteDialogOpen: false,
        formError: null,
        deleteEstablishmentTypeData: null,
        setSelectedEstablishmentType: (establishmentType) =>
            set({ selectedEstablishmentType: establishmentType }),
        setIsAddEditDialogOpen: (open) => set({ isAddEditDialogOpen: open }),
        setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
        setFormError: (error) => set({ formError: error }),
    })
);
