import { monsterRepository } from "../repositories/monsterRepository";
import type { CreateMonsterInput } from "../types/Monster";
import { abilityRepository } from "../repositories/abilityRepository";

export const monsterService = {
  getAll() {
    return monsterRepository.getAll();
  },

  getById(id: number) {
    return monsterRepository.getById(id);
  },

  async add(input: CreateMonsterInput) {
    // Validate that all provided ability IDs exist in the database before creating the monster.
    const abilityIds = input.abilityIds ?? [];

    if (abilityIds.length > 0) {
      const existingCount =
        await abilityRepository.countByIds(abilityIds);

      if (existingCount !== abilityIds.length) {
        throw new Error(
          "One or more selected abilities do not exist."
        );
      }
    }
    return monsterRepository.add(input);
  },

  remove(id: number) {
    return monsterRepository.remove(id);
  }
};