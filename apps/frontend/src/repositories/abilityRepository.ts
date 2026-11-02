import type { Ability } from "../types/Monster";

// Use the same API URL configuration as monsterRepository.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:3000";

export const abilityRepository = {
  async getAll(): Promise<Ability[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/abilities`
    );

    if (!response.ok) {
      throw new Error("Unable to load abilities.");
    }

    return response.json();
  }
};