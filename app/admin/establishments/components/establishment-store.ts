"use client";

import { create } from "zustand";

import { Establishment } from "@/core/entities/establishment.entity";

interface EstablishmentState {
    selectedEstablishment: Establishment | null;
    isAddEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    formError: string | null;
    openForAdd: () => void;
    openForEdit: (establishment: Establishment) => void;
    openForDelete: (establishment: Establishment) => void;
    closeDialogs: () => void;
    setFormError: (error: string | null) => void;
}

export const useEstablishmentStore = create<EstablishmentState>((set) => ({
    selectedEstablishment: null,
    isAddEditDialogOpen: false,
    isDeleteDialogOpen: false,
    formError: null,
    openForAdd: () =>
        set({
            isAddEditDialogOpen: true,
            selectedEstablishment: null,
            formError: null,
        }),
    openForEdit: (establishment) =>
        set({
            isAddEditDialogOpen: true,
            selectedEstablishment: establishment,
            formError: null,
        }),
    openForDelete: (establishment) =>
        set({
            isDeleteDialogOpen: true,
            selectedEstablishment: establishment,
        }),
    closeDialogs: () =>
        set({
            isAddEditDialogOpen: false,
            isDeleteDialogOpen: false,
            selectedEstablishment: null,
            formError: null,
        }),
    setFormError: (error) => set({ formError: error }),
}));
