import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SelectorOption {
    value: string;
    label: string;
    [key: string]: any; // Index signature for compatibility with MultipleSelector Option type
}

interface SelectorsState {
    // Selected values (only user selections)
    selectedCity: SelectorOption | null;
    selectedDomain: SelectorOption | null;
    selectedLevel: SelectorOption | null;
    
    // Actions for user selections
    setSelectedCity: (city: SelectorOption | null) => void;
    setSelectedDomain: (domain: SelectorOption | null) => void;
    setSelectedLevel: (level: SelectorOption | null) => void;
    
    // Reset all selections
    resetSelections: () => void;
}

export const useSelectorsStore = create<SelectorsState>()(
    devtools(
        (set) => ({
            // Initial state - only user selections
            selectedCity: null,
            selectedDomain: null,
            selectedLevel: null,
            
            // Actions for user selections only
            setSelectedCity: (city) => 
                set({ selectedCity: city }, false, 'setSelectedCity'),
            
            setSelectedDomain: (domain) => 
                set({ selectedDomain: domain }, false, 'setSelectedDomain'),
            
            setSelectedLevel: (level) => 
                set({ selectedLevel: level }, false, 'setSelectedLevel'),
            
            resetSelections: () => 
                set({ 
                    selectedCity: null, 
                    selectedDomain: null, 
                    selectedLevel: null 
                }, false, 'resetSelections'),
        }),
        {
            name: 'selectors-store',
        }
    )
);
