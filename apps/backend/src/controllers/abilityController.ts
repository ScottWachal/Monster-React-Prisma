
import type { RequestHandler, Response } from "express";
import { abilityService } from "../services/abilityService";
import { abilitySchema } from "../validations/abilityValidation";

function parseId(value: string | string[]): number | null {
  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// Handle common database errors without new middleware.
function handleError(res: Response, error: unknown): void {
  const code =
    error !== null &&
    typeof error === "object" &&
    "code" in error
      ? error.code
      : undefined;

  if (code === "P2002") {
    res.status(409).json({
      error: "A unique constraint was violated."
    });
    return;
  }

  if (code === "P2003") {
    res.status(409).json({
      error: "This ability is used by a monster and cannot be deleted."
    });
    return;
  }

  if (code === "P2025") {
    res.status(404).json({
      error: "Ability not found."
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: "Internal server error."
  });
}

// Get all abilities.
export const getAbilities: RequestHandler =
  async (_req, res) => {
    try {
      res.json(await abilityService.getAll());
    } catch (error) {
      handleError(res, error);
    }
  };

  // Get a single ability by ID.
export const getAbilityById: RequestHandler =
  async (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({ error: "Invalid ability ID." });
      return;
    }

    try {
      const ability = await abilityService.getById(id);

      if (!ability) {
        res.status(404).json({ error: "Ability not found." });
        return;
      }

      res.json(ability);
    } catch (error) {
      handleError(res, error);
    }
  };

export const createAbility: RequestHandler =
  async (req, res) => {
    const parsed = abilitySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0]?.message ?? "Invalid ability."
      });
      return;
    }

    try {
      const ability = await abilityService.add(parsed.data);
      res.status(201).json(ability);
    } catch (error) {
      handleError(res, error);
    }
  };

export const updateAbility: RequestHandler =
  async (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({ error: "Invalid ability ID." });
      return;
    }

    const parsed = abilitySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0]?.message ?? "Invalid ability."
      });
      return;
    }

    try {
      const ability = await abilityService.update(id, parsed.data);
      res.json(ability);
    } catch (error) {
      handleError(res, error);
    }
  };

export const deleteAbility: RequestHandler =
  async (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({ error: "Invalid ability ID." });
      return;
    }

    try {
      const result = await abilityService.remove(id);

      if (result === "in-use") {
        res.status(409).json({
          error: "This ability is used by a monster and cannot be deleted."
        });
        return;
      }

      if (result === "not-found") {
        res.status(404).json({
          error: "Ability not found."
        });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      handleError(res, error);
    }
  };
