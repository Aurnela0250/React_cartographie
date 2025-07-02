import { create } from "zustand";

import { Mention } from "@/core/entities/mention.entity";

interface MentionStoreState {
    isAddEditDialogOpen: boolean;
    setIsAddEditDialogOpen: (open: boolean) => void;
    selectedMention: Mention | null;
    setSelectedMention: (mention: Mention | null) => void;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (open: boolean) => void;
    formError: string | null;
    setFormError: (error: string | null) => void;
}

export const useMentionStore = create<MentionStoreState>((set) => ({
    isAddEditDialogOpen: false,
    setIsAddEditDialogOpen: (open) => set({ isAddEditDialogOpen: open }),
    selectedMention: null,
    setSelectedMention: (mention) => set({ selectedMention: mention }),
    isDeleteDialogOpen: false,
    setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
    formError: null,
    setFormError: (error) => set({ formError: error }),
}));
