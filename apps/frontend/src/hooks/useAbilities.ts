
import { useEffect, useState } from "react";
import { abilityService } from "../services/abilityService";
import type { Ability, AbilityInput } from "../types/Monster";

function getMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong.";
}

export function useAbilities() {
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    abilityService.getAbilities()
      .then((data) => {
        if (active) setAbilities(data);
      })
      .catch((error) => {
        if (active) setError(getMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function addAbility(input: AbilityInput): Promise<boolean> {
    setError(null);

    try {
      const created = await abilityService.addAbility(input);

      setAbilities((current) =>
        [...current, created].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

      return true;
    } catch (error) {
      setError(getMessage(error));
      return false;
    }
  }

  async function updateAbility(
    id: number,
    input: AbilityInput
  ): Promise<boolean> {
    setError(null);

    try {
      const updated = await abilityService.updateAbility(id, input);

      setAbilities((current) =>
        current.map((ability) =>
          ability.id === id ? updated : ability
        ).sort((a, b) => a.name.localeCompare(b.name))
      );

      return true;
    } catch (error) {
      setError(getMessage(error));
      return false;
    }
  }

  async function removeAbility(id: number): Promise<boolean> {
    setError(null);

    try {
      await abilityService.removeAbility(id);

      setAbilities((current) =>
        current.filter((ability) => ability.id !== id)
      );

      return true;
    } catch (error) {
      setError(getMessage(error));
      return false;
    }
  }

  return {
    abilities,
    loading,
    error,
    addAbility,
    updateAbility,
    removeAbility
  };
}
