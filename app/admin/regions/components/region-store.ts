"use client";

import { create } from "zustand";

import { Region } from "@/core/entities/region.entity";

interface RegionState {
    selectedRegion: Region | null;
    isAddEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    formError: string | null;
    deleteRegionData: Region | null;
    setSelectedRegion: (region: Region | null) => void;
    setIsAddEditDialogOpen: (open: boolean) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
    setFormError: (error: string | null) => void;
    setDeleteRegionData: (region: Region | null) => void;
}

export const useRegionStore = create<RegionState>((set) => ({
    selectedRegion: null,
    isAddEditDialogOpen: false,
    isDeleteDialogOpen: false,
    formError: null,
    deleteRegionData: null,
    setSelectedRegion: (region) => set({ selectedRegion: region }),
    setIsAddEditDialogOpen: (open) => set({ isAddEditDialogOpen: open }),
    setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
    setFormError: (error) => set({ formError: error }),
    setDeleteRegionData: (region) => set({ deleteRegionData: region }),
}));
