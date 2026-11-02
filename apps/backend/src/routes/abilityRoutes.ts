import { Router } from "express";
import { getAbilities } from "../controllers/abilityController";

const router = Router();

router.get("/", getAbilities);

export default router;