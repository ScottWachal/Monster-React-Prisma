import type { Request, Response } from "express";
import type { CreateMonsterInput } from "../types/Monster";
import { monsterService } from "../services/monsterService";

export const monsterController = {
  async getAll(_req: Request, res: Response) {
    const monsters = await monsterService.getAll();
    res.json(monsters);
  },

  async getById(req: Request, res: Response) {
    const monster = await monsterService.getById(
      Number(req.params.id)
    );

    if (!monster) {
      res.status(404).json({ error: "Monster not found" });
      return;
    }

    res.json(monster);
  },

  async add(req: Request, res: Response) {
    // Body has already passed validation middleware
    const monster = await monsterService.add(
      req.body as CreateMonsterInput
    );

    res.status(201).json(monster);
  },

  async remove(req: Request, res: Response) {
    const removed = await monsterService.remove(
      Number(req.params.id)
    );

    if (!removed) {
      res.status(404).json({ error: "Monster not found" });
      return;
    }

    res.sendStatus(204);
  }
};