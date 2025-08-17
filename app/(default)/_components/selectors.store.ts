import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SelectorOption {
    value: string;
    label: string;
    [key: string]: any; // Index signature for compatibility with MultipleSelector Option type
}

interface SelectorsState {
    // Selected values (only user selections)
    selectedCities: SelectorOption[];
    selectedDomains: SelectorOption[];
    selectedLevels: SelectorOption[];
    
    // Actions for user selections
    setSelectedCities: (cities: SelectorOption[]) => void;
    setSelectedDomains: (domains: SelectorOption[]) => void;
    setSelectedLevels: (levels: SelectorOption[]) => void;
    
    // Reset all selections
    resetSelections: () => void;
}

export const useSelectorsStore = create<SelectorsState>()(
    devtools(
        (set) => ({
            // Initial state - only user selections
            selectedCities: [],
            selectedDomains: [],
            selectedLevels: [],
            
            // Actions for user selections only
            setSelectedCities: (cities) => 
                set({ selectedCities: cities }, false, 'setSelectedCities'),
            
            setSelectedDomains: (domains) => 
                set({ selectedDomains: domains }, false, 'setSelectedDomains'),
            
            setSelectedLevels: (levels) => 
                set({ selectedLevels: levels }, false, 'setSelectedLevels'),
            
            resetSelections: () => 
                set({ 
                    selectedCities: [], 
                    selectedDomains: [], 
                    selectedLevels: [] 
                }, false, 'resetSelections'),
        }),
        {
            name: 'selectors-store',
        }
    )
);
