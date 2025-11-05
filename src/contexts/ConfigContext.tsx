"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ConfigContextValue {
  configs: Record<string, string>;
  loading: boolean;
  error: string | null;
  get: (key: string, defaultValue?: string) => string;
  getBoolean: (key: string, defaultValue?: boolean) => boolean;
  getNumber: (key: string, defaultValue?: number) => number;
  isFeatureEnabled: (featureName: string) => boolean;
  refresh: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/config/public`);

      if (!response.ok) {
        throw new Error("Failed to fetch configurations");
      }

      const data = await response.json();
      setConfigs(data.data.configs || {});
    } catch (err) {
      console.error("Failed to load configurations:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      // Set empty configs on error to prevent app breaking
      setConfigs({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const get = (key: string, defaultValue = ""): string => {
    return configs[key] || defaultValue;
  };

  const getBoolean = (key: string, defaultValue = false): boolean => {
    const value = configs[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === "true" || value === "1";
  };

  const getNumber = (key: string, defaultValue = 0): number => {
    const value = configs[key];
    if (!value) return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  };

  const isFeatureEnabled = (featureName: string): boolean => {
    const key = `ENABLE_${featureName.toUpperCase()}`;
    return getBoolean(key, false);
  };

  const refresh = async () => {
    await fetchConfigs();
  };

  const value: ConfigContextValue = {
    configs,
    loading,
    error,
    get,
    getBoolean,
    getNumber,
    isFeatureEnabled,
    refresh,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValue {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}

// Convenience hooks for common config access patterns
export function useFeatureFlag(featureName: string): boolean {
  const { isFeatureEnabled } = useConfig();
  return isFeatureEnabled(featureName);
}

export function useConfigValue(key: string, defaultValue = ""): string {
  const { get } = useConfig();
  return get(key, defaultValue);
}
