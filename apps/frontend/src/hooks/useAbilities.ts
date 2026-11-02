import { useEffect, useState } from "react";
import { abilityService } from "../services/abilityService";
import type { Ability } from "../types/Monster";

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
        if (active) setError(
          error instanceof Error ? error.message : "Unable to load abilities."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { abilities, loading, error };
}