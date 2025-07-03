"use client";

import { create } from "zustand";

import { Level } from "@/core/entities/level.entity";

interface LevelState {
    selectedLevel: Level | null;
    isAddEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    formError: string | null;
    setSelectedLevel: (level: Level | null) => void;
    setIsAddEditDialogOpen: (open: boolean) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
    setFormError: (error: string | null) => void;
}

export const useLevelStore = create<LevelState>((set) => ({
    selectedLevel: null,
    isAddEditDialogOpen: false,
    isDeleteDialogOpen: false,
    formError: null,
    deleteLevelData: null,
    setSelectedLevel: (level) => set({ selectedLevel: level }),
    setIsAddEditDialogOpen: (open) => set({ isAddEditDialogOpen: open }),
    setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
    setFormError: (error) => set({ formError: error }),
}));
