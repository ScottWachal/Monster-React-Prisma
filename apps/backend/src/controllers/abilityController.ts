import type { RequestHandler } from "express";
import { abilityService } from "../services/abilityService";

export const getAbilities: RequestHandler =
  async (_req, res, next) => {
    try {
      const abilities = await abilityService.getAll();
      res.json(abilities);
    } catch (error) {
      next(error);
    }
  };