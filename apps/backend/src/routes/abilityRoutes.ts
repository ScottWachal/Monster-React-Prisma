import { Router } from "express";

import {
  getAbilities,
  getAbilityById,
  createAbility,
  updateAbility,
  deleteAbility
} from "../controllers/abilityController";

const router = Router();

router.get("/", getAbilities);
router.get("/:id", getAbilityById);
router.post("/", createAbility);
router.put("/:id", updateAbility);
router.delete("/:id", deleteAbility);

export default router;