import { useEffect, useState } from "react";
import { monsterService } from "../services/monsterService";
import type { Monster } from "../types/Monster";

export function useMonster(
  id: number | undefined,
) {
  const [monster, setMonster] =
    useState<Monster | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMonster() {
      setLoading(true);
      setError(null);
      setMonster(null);

      if (id === undefined) {
        setError("Invalid monster ID.");
        setLoading(false);
        return;
      }

      try {
        const monster =
          await monsterService.getMonsterById(id);

        if (ignore) {
          return;
        }

        if (!monster) {
          setError("Monster not found.");
          return;
        }

        setMonster(monster);
      } catch {
        if (!ignore) {
          setError("Unable to load monster.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMonster();

    return () => {
      ignore = true;
    };
  }, [id]);

  async function removeMonster(): Promise<boolean> {
    if (!monster) {
      return false;
    }

    setError(null);

    try {
      await monsterService.removeMonster(monster.id);
      setMonster(null);

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
    monster,
    loading,
    error,
    removeMonster,
  };
}