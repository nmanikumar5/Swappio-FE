import { useEffect, useState } from 'react';

export default function useDebouncedValue<T>(value: T, wait = 250) {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), wait);
        return () => clearTimeout(t);
    }, [value, wait]);

    return debounced;
}
