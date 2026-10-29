import { monsterRepository } from "../repositories/monsterRepository";
import type {
  CreateMonsterInput,
  Monster,
} from "../types/Monster";

function validateMonster(input: CreateMonsterInput): void {
  const errors: string[] = [];

  if (input.name.trim().length < 2) {
    errors.push(
      "Monster name must be at least 2 characters.",
    );
  }

  const validLevel =
    Number.isInteger(input.level) &&
    input.level >= 1 &&
    input.level <= 20;

  if (!validLevel) {
    errors.push(
      "Monster level must be a whole number from 1 to 20.",
    );
  }

  if (
    !Number.isFinite(input.hitPoints) ||
    input.hitPoints < 0
  ) {
    errors.push(
      "Hit points must be a non-negative number.",
    );
  } else if (
    validLevel &&
    input.hitPoints < input.level * 5
  ) {
    errors.push(
      `A level ${input.level} monster must have at least ${
        input.level * 5
      } hit points.`,
    );
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
}

export const monsterService = {
  async getMonsters(): Promise<Monster[]> {
    return monsterRepository.getAll();
  },

  async getMonsterById(
    id: number,
  ): Promise<Monster | null> {
    if (!Number.isInteger(id) || id < 1) {
      return null;
    }

    return monsterRepository.getById(id);
  },

  async addMonster(
    input: CreateMonsterInput,
  ): Promise<Monster> {
    const monsterInput: CreateMonsterInput = {
      ...input,
      name: input.name.trim(),
      description:
        input.description?.trim() || undefined,
    };

    validateMonster(monsterInput);

    return monsterRepository.add(monsterInput);
  },

  async removeMonster(id: number): Promise<void> {
    if (!Number.isInteger(id) || id < 1) {
      throw new Error("Invalid monster ID.");
    }

    const removed = await monsterRepository.remove(id);

    if (!removed) {
      throw new Error("Monster not found.");
    }
  },
};