import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
    location: string;
    coords: { lat: number; lng: number } | null;
    locationSet: boolean;
    setLocation: (location: string, coords?: { lat: number; lng: number } | null) => void;
    clearLocation: () => void;
    hasValidLocation: () => boolean;
}

export const useLocationStore = create<LocationState>()(
    persist(
        (set, get) => ({
            location: "",
            coords: null,
            locationSet: false,
            setLocation: (location: string, coords = null) =>
                set({
                    location,
                    coords,
                    locationSet: true,
                }),
            clearLocation: () =>
                set({
                    location: "",
                    coords: null,
                    locationSet: false,
                }),
            hasValidLocation: () => {
                const state = get();
                return state.locationSet && state.location.trim().length > 0;
            },
        }),
        {
            name: "swappio:location",
        }
    )
);
