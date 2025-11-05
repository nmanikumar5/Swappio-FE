"use client";

import { useState } from "react";
import { MapPin, Navigation, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocationStore } from "@/stores/locationStore";
import MapboxPlaceAutocomplete from "@/components/location/MapboxPlaceAutocomplete";

export default function LocationSelector() {
  const { location, coords, setLocation } = useLocationStore();
  const [geocoding, setGeocoding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) return;

    setGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );
          if (!res.ok) throw new Error("geocode failed");
          const data = await res.json();
          setLocation(
            data.displayName ||
              `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            { lat: latitude, lng: longitude }
          );
          setIsOpen(false);
        } catch (err) {
          console.warn("Reverse geocode failed", err);
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, {
            lat: latitude,
            lng: longitude,
          });
          setIsOpen(false);
        } finally {
          setGeocoding(false);
        }
      },
      (err) => {
        console.warn("Geolocation failed:", err);
        setGeocoding(false);
      }
    );
  };

  const displayLocation = location || "Set Location";
  const truncatedLocation =
    displayLocation.length > 20
      ? displayLocation.substring(0, 20) + "..."
      : displayLocation;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hidden md:flex items-center gap-2 hover:bg-primary/10 transition-colors group max-w-[200px]"
        >
          <MapPin
            className={`h-4 w-4 ${
              location ? "text-primary" : "text-muted-foreground"
            } group-hover:text-primary transition-colors`}
          />
          <span className="text-sm font-medium truncate">
            {truncatedLocation}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[320px] p-4 bg-card shadow-xl border-2 rounded-xl"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Select Location
            </h3>
            <p className="text-xs text-muted-foreground">
              Choose your location to see nearby listings
            </p>
          </div>

          <div className="space-y-3">
            <MapboxPlaceAutocomplete
              value={location}
              onChange={(v) => setLocation(v, coords)}
              onSelect={(v, newCoords) => {
                setLocation(v, newCoords || null);
                setIsOpen(false);
              }}
            />

            <Button
              onClick={handleUseMyLocation}
              variant="outline"
              className="w-full justify-center gap-2 hover:bg-primary/10 hover:border-primary transition-all"
              disabled={geocoding}
            >
              <Navigation
                className={`h-4 w-4 ${geocoding ? "animate-spin" : ""}`}
              />
              {geocoding ? "Detecting..." : "Use My Current Location"}
            </Button>
          </div>

          {location && (
            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground">Current:</p>
              <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-2">
                <MapPin className="h-3 w-3 text-primary" />
                {location}
              </p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
