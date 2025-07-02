"use client";

import { create } from "zustand";

import { Region } from "@/core/entities/region.entity";

// Typage strict de l'état du store pour la gestion des régions
export interface RegionState {
    selectedRegion: Region | null;
    isAddEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    formError: string | null;
    setSelectedRegion: (region: Region | null) => void;
    setIsAddEditDialogOpen: (open: boolean) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
    setFormError: (error: string | null) => void;
}

// Store Zustand pour la gestion des régions (sélection, dialogs, erreurs)
export const useRegionStore = create<RegionState>((set) => ({
    selectedRegion: null,
    isAddEditDialogOpen: false,
    isDeleteDialogOpen: false,
    formError: null,
    setSelectedRegion: (region) => set({ selectedRegion: region }),
    setIsAddEditDialogOpen: (open) => set({ isAddEditDialogOpen: open }),
    setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
    setFormError: (error) => set({ formError: error }),
}));
