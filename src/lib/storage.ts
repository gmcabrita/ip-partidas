import type { Station, ColumnVisibility } from "@/types";

const STORAGE_KEYS = {
  STATION: "ip-partidas-station",
  SERVICE_TYPES: "ip-partidas-service-types",
  COLUMN_VISIBILITY: "ip-partidas-column-visibility",
  DESTINATIONS: "ip-partidas-destinations",
} as const;

export function saveStation(station: Station | null): void {
  if (station) {
    localStorage.setItem(STORAGE_KEYS.STATION, JSON.stringify(station));
  } else {
    localStorage.removeItem(STORAGE_KEYS.STATION);
  }
}

export function loadStation(): Station | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATION);
    if (stored) {
      return JSON.parse(stored) as Station;
    }
  } catch (error) {
    console.error("Failed to load station from localStorage:", error);
  }
  return null;
}

export function saveServiceTypes(serviceTypes: string[]): void {
  localStorage.setItem(STORAGE_KEYS.SERVICE_TYPES, JSON.stringify(serviceTypes));
}

export function loadServiceTypes(): string[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SERVICE_TYPES);
    if (stored) {
      return JSON.parse(stored) as string[];
    }
  } catch (error) {
    console.error("Failed to load service types from localStorage:", error);
  }
  return null;
}

export function saveColumnVisibility(visibility: ColumnVisibility): void {
  localStorage.setItem(STORAGE_KEYS.COLUMN_VISIBILITY, JSON.stringify(visibility));
}

export function loadColumnVisibility(): ColumnVisibility | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COLUMN_VISIBILITY);
    if (stored) {
      return JSON.parse(stored) as ColumnVisibility;
    }
  } catch (error) {
    console.error("Failed to load column visibility from localStorage:", error);
  }
  return null;
}

export function saveDestinations(destinations: string[]): void {
  localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(destinations));
}

export function loadDestinations(): string[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
    if (stored) {
      return JSON.parse(stored) as string[];
    }
  } catch (error) {
    console.error("Failed to load destinations from localStorage:", error);
  }
  return null;
}
