
import type { Ability, AbilityInput } from "../types/Monster";

// Match the API URL configuration used by monsterRepository.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:3000";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    options
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.error ?? `Request failed (${response.status}).`
    );
  }

  // Successful DELETE returns 204 with no response body.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const abilityRepository = {
  getAll(): Promise<Ability[]> {
    return request<Ability[]>("/api/abilities");
  },

  add(input: AbilityInput): Promise<Ability> {
    return request<Ability>("/api/abilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
  },

  update(
    id: number,
    input: AbilityInput
  ): Promise<Ability> {
    return request<Ability>(`/api/abilities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
  },

  remove(id: number): Promise<void> {
    return request<void>(`/api/abilities/${id}`, {
      method: "DELETE"
    });
  }
};
