import type {
  Monster,
  CreateMonsterInput
} from "../types/Monster";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const endpoint = `${baseUrl}/api/monsters`;

async function readJson<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const monsterRepository = {
  async getAll(): Promise<Monster[]> {
    const response = await fetch(endpoint);
    return readJson<Monster[]>(response);
  },

  async getById(id: number): Promise<Monster | null> {
    const response = await fetch(`${endpoint}/${id}`);

    if (response.status === 404) return null;

    return readJson<Monster>(response);
  },

  async add(input: CreateMonsterInput): Promise<Monster> {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    return readJson<Monster>(response);
  },

  async remove(id: number): Promise<boolean> {
    const response = await fetch(`${endpoint}/${id}`, {
      method: "DELETE"
    });

    if (response.status === 404) return false;

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return true;
  }
};