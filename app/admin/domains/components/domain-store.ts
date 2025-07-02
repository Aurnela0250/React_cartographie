"use client";

import { create } from "zustand";

import { Domain } from "@/core/entities/domain.entity";

interface DomainState {
    selectedDomain: Domain | null;
    isAddEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    formError: string | null;
    deleteDomainData: Domain | null;
    setSelectedDomain: (domain: Domain | null) => void;
    setIsAddEditDialogOpen: (open: boolean) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
    setFormError: (error: string | null) => void;
    setDeleteDomainData: (domain: Domain | null) => void;
}

export const useDomainStore = create<DomainState>((set) => ({
    selectedDomain: null,
    isAddEditDialogOpen: false,
    isDeleteDialogOpen: false,
    formError: null,
    deleteDomainData: null,
    setSelectedDomain: (domain) => set({ selectedDomain: domain }),
    setIsAddEditDialogOpen: (open) => set({ isAddEditDialogOpen: open }),
    setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
    setFormError: (error) => set({ formError: error }),
    setDeleteDomainData: (domain) => set({ deleteDomainData: domain }),
}));
