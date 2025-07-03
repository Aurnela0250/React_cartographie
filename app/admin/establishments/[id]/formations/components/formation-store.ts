import { create } from "zustand";

import type { Formation } from "@/core/entities/formation.entity";

interface FormationState {
    selectedFormation: Formation | null;
    isAddEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    isAuthorizationDialogOpen: boolean;
    formError: string | null;
    setSelectedFormation: (formation: Formation | null) => void;
    setIsAddEditDialogOpen: (open: boolean) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
    setIsAuthorizationDialogOpen: (open: boolean) => void;
    setFormError: (error: string | null) => void;
}

export const useFormationStore = create<FormationState>((set) => ({
    selectedFormation: null,
    isAddEditDialogOpen: false,
    isDeleteDialogOpen: false,
    isAuthorizationDialogOpen: false,
    formError: null,
    setSelectedFormation: (formation) => set({ selectedFormation: formation }),
    setIsAddEditDialogOpen: (open) => set({ isAddEditDialogOpen: open }),
    setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
    setIsAuthorizationDialogOpen: (open) =>
        set({ isAuthorizationDialogOpen: open }),
    setFormError: (error) => set({ formError: error }),
}));
