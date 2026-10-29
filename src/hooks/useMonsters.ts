import { useEffect, useState } from "react";
import { monsterService } from "../services/monsterService";
import type {
  CreateMonsterInput,
  Monster,
} from "../types/Monster";

export function useMonsters() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMonsters() {
      try {
        const monsters =
          await monsterService.getMonsters();

        if (!ignore) {
          setMonsters(monsters);
        }
      } catch {
        if (!ignore) {
          setError("Unable to load monsters.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMonsters();

    return () => {
      ignore = true;
    };
  }, []);

  async function addMonster(
    input: CreateMonsterInput,
  ): Promise<boolean> {
    setError(null);

    try {
      const monster =
        await monsterService.addMonster(input);

      setMonsters((current) => [
        ...current,
        monster,
      ]);

      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add monster.",
      );

      return false;
    }
  }

  async function removeMonster(
    id: number,
  ): Promise<boolean> {
    setError(null);

    try {
      await monsterService.removeMonster(id);

      setMonsters((current) =>
        current.filter(
          (monster) => monster.id !== id,
        ),
      );

      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to remove monster.",
      );

      return false;
    }
  }

  return {
    monsters,
    loading,
    error,
    addMonster,
    removeMonster,
  };
}