import { abilityRepository } from "../repositories/abilityRepository";
import type { AbilityInput } from "../types/Monster";

export const abilityService = {
  getAll() {
    return abilityRepository.getAll();
  },

  getById(id: number) {
    return abilityRepository.getById(id);
  },

  add(input: AbilityInput) {
    return abilityRepository.add(input);
  },

  update(id: number, input: AbilityInput) {
    return abilityRepository.update(id, input);
  },

  async remove(
    id: number
  ): Promise<"deleted" | "not-found" | "in-use"> {
    const usageCount =
      await abilityRepository.countUsage(id);

    if (usageCount > 0) {
      return "in-use";
    }

    const removed = await abilityRepository.remove(id);

    return removed ? "deleted" : "not-found";
  }
};