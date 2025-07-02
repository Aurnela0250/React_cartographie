"use client";

import { create } from "zustand";

import { City } from "@/core/entities/city.entity";

interface CityState {
    selectedCity: City | null;
    isAddEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    formError: string | null;
    setSelectedCity: (city: City | null) => void;
    setIsAddEditDialogOpen: (open: boolean) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
    setFormError: (error: string | null) => void;
}

export const useCityStore = create<CityState>((set) => ({
    selectedCity: null,
    isAddEditDialogOpen: false,
    isDeleteDialogOpen: false,
    formError: null,
    setSelectedCity: (city) => set({ selectedCity: city }),
    setIsAddEditDialogOpen: (open) => set({ isAddEditDialogOpen: open }),
    setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
    setFormError: (error) => set({ formError: error }),
}));
