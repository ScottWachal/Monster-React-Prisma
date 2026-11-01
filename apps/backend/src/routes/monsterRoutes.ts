import { Router } from "express";
import { monsterController } from "../controllers/monsterController";
import {
  validateMonsterBody,
  validateMonsterId
} from "../validations/monsterValidation";

export const monsterRoutes = Router();

monsterRoutes.get(
  "/",
  monsterController.getAll
);

monsterRoutes.get(
  "/:id",
  validateMonsterId,
  monsterController.getById
);

monsterRoutes.post(
  "/",
  validateMonsterBody,
  monsterController.add
);

monsterRoutes.delete(
  "/:id",
  validateMonsterId,
  monsterController.remove
);