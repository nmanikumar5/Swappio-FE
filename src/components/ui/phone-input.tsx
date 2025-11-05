"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone } from "lucide-react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

interface CountryCode {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

// Popular country codes
const countryCodes: CountryCode[] = [
  { code: "IN", name: "India", dial_code: "+91", flag: "🇮🇳" },
  { code: "US", name: "United States", dial_code: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial_code: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dial_code: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dial_code: "+61", flag: "🇦🇺" },
  { code: "AE", name: "United Arab Emirates", dial_code: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dial_code: "+966", flag: "🇸🇦" },
  { code: "SG", name: "Singapore", dial_code: "+65", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", dial_code: "+60", flag: "🇲🇾" },
  { code: "PK", name: "Pakistan", dial_code: "+92", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", dial_code: "+880", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", dial_code: "+94", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", dial_code: "+977", flag: "🇳🇵" },
  { code: "DE", name: "Germany", dial_code: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial_code: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dial_code: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dial_code: "+34", flag: "🇪🇸" },
  { code: "JP", name: "Japan", dial_code: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", dial_code: "+86", flag: "🇨🇳" },
  { code: "KR", name: "South Korea", dial_code: "+82", flag: "🇰🇷" },
];

export default function PhoneInput({
  value,
  onChange,
  placeholder = "98765 43210",
  required = false,
  id = "phone",
  className = "",
}: PhoneInputProps) {
  // Extract country code and number from value
  const getCountryCodeAndNumber = (phoneValue: string) => {
    if (!phoneValue) return { countryCode: "+91", number: "" };

    // Find matching country code
    for (const country of countryCodes) {
      if (phoneValue.startsWith(country.dial_code)) {
        return {
          countryCode: country.dial_code,
          number: phoneValue.substring(country.dial_code.length).trim(),
        };
      }
    }

    // Default to India if no match
    return { countryCode: "+91", number: phoneValue.replace(/^\+/, "").trim() };
  };

  const { countryCode: initialCode, number: initialNumber } =
    getCountryCodeAndNumber(value);
  const [selectedCountryCode, setSelectedCountryCode] = useState(initialCode);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);

  const handleCountryCodeChange = (newCode: string) => {
    setSelectedCountryCode(newCode);
    onChange(`${newCode}${phoneNumber}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^\d]/g, ""); // Only allow digits
    setPhoneNumber(newNumber);
    onChange(`${selectedCountryCode}${newNumber}`);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />

      {/* Country Code Selector */}
      <Select
        value={selectedCountryCode}
        onValueChange={handleCountryCodeChange}
      >
        <SelectTrigger className="w-[140px]" id={`${id}-country`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.dial_code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.dial_code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Phone Number Input */}
      <Input
        id={id}
        type="tel"
        placeholder={placeholder}
        value={phoneNumber}
        onChange={handleNumberChange}
        required={required}
        className="flex-1"
      />
    </div>
  );
}
