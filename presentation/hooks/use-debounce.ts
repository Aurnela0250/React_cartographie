"use client";

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Mettre à jour la valeur débouncée après le délai spécifié
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Annuler le timeout si la valeur change (par exemple, l'utilisateur continue de taper)
        // ou si le délai change ou si le composant est démonté.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Se ré-exécuter uniquement si la valeur ou le délai change

    return debouncedValue;
}
