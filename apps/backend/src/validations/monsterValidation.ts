import type { RequestHandler } from "express";
import { z } from "zod";

const createMonsterSchema = z.object({
  name: z.string().trim().min(2),
  level: z.number().int().min(1).max(20),
  hitPoints: z.number().int().nonnegative(),
  description: z.string().trim().optional(),
  abilityIds: z
  .array(z.number().int().positive())
  .max(3, "A monster can have at most 3 abilities.")
  .refine(
    (ids) => new Set(ids).size === ids.length,
    "Duplicate abilities are not allowed."
  )
  .default([])
}).strict().refine(
  (monster) => monster.hitPoints >= monster.level * 5,
  {
    message: "Hit points must be at least level × 5",
    path: ["hitPoints"]
  }
);

export const validateMonsterBody: RequestHandler = (
  req, res, next
) => {
  const result = createMonsterSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid monster",
      details: z.flattenError(result.error)
    });
    return;
  }

  req.body = result.data;
  next();
};

export const validateMonsterId: RequestHandler = (
  req, res, next
) => {
  const result = z.coerce.number()
    .int()
    .positive()
    .safeParse(req.params.id);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid monster ID"
    });
    return;
  }

  next();
};