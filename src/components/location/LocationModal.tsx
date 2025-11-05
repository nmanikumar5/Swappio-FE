"use client";

import { useState } from "react";
import { useLocationStore } from "@/stores/locationStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapboxPlaceAutocomplete from "@/components/location/MapboxPlaceAutocomplete";
import { MapPin, Navigation } from "lucide-react";

interface LocationModalProps {
  onLocationSet?: () => void;
}

export default function LocationModal({ onLocationSet }: LocationModalProps) {
  const { location, setLocation, hasValidLocation } = useLocationStore();
  const [tempLocation, setTempLocation] = useState(location);
  const [tempCoords, setTempCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [detecting, setDetecting] = useState(false);

  const handleSaveLocation = () => {
    if (tempLocation.trim()) {
      setLocation(tempLocation, tempCoords);
      onLocationSet?.();
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            const displayName =
              data.displayName ||
              `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
            setTempLocation(displayName);
            setTempCoords({ lat: latitude, lng: longitude });
          } else {
            setTempLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            setTempCoords({ lat: latitude, lng: longitude });
          }
        } catch (err) {
          console.warn("Reverse geocode failed", err);
          setTempLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          setTempCoords({ lat: latitude, lng: longitude });
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        console.warn("Geolocation failed:", err);
        alert("Could not detect your location. Please enter it manually.");
        setDetecting(false);
      }
    );
  };

  // Don't render if location is already set
  if (hasValidLocation()) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 gradient-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Set Your Location</CardTitle>
          <CardDescription className="text-base mt-2">
            To show you relevant listings nearby, we need to know your location.
            This helps you find items in your area!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter Your Location</label>
            <MapboxPlaceAutocomplete
              value={tempLocation}
              onChange={setTempLocation}
              onSelect={(loc, coords) => {
                setTempLocation(loc);
                setTempCoords(coords || null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              e.g., Bangalore, Mumbai, Delhi, etc.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleUseCurrentLocation}
            disabled={detecting}
          >
            <Navigation className="mr-2 h-4 w-4" />
            {detecting ? "Detecting..." : "Use Current Location"}
          </Button>

          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary"
            onClick={handleSaveLocation}
            disabled={!tempLocation.trim()}
          >
            Continue
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You can change your location anytime from the header
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
