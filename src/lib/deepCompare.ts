export const deepEqual = (obj1: unknown, obj2: unknown): boolean => {
    // Controlla se i due oggetti sono uguali in modo superficiale (tipo primitivo o riferimenti identici)
    if (obj1 === obj2) return true;

    // Se uno dei due è undefined o null, i due oggetti non sono uguali
    if (obj1 == null || obj2 == null) return false;

    // Se sono oggetti o array
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
        // Se entrambi sono array
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            // Se le lunghezze sono diverse, non sono uguali
            if (obj1.length !== obj2.length) return false;

            // Confronta ogni elemento degli array
            for (let i = 0; i < obj1.length; i++)
                if (!deepEqual(obj1[i], obj2[i])) return false;

            return true;
        }

        // Se sono oggetti, confronta ogni chiave
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Se i numeri di chiavi sono diversi, non sono uguali
        if (keys1.length !== keys2.length) return false;

        // Confronta ricorsivamente le proprietà
        for (const key of keys1) {
            // Verifica se la proprietà esiste anche nell'altro oggetto
            if (!keys2.includes(key)) return false;

            // Confronta i valori della proprietà
            if (!deepEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key])) return false;
        }

        return true;
    }

    // Se sono di tipo diverso, non sono uguali
    return false;
};
