import { abilityRepository } from "../repositories/abilityRepository";
import type { AbilityInput } from "../types/Monster";

export const abilityService = {
  getAbilities() {
    return abilityRepository.getAll();
  },

  addAbility(input: AbilityInput) {
    return abilityRepository.add(input);
  },

  updateAbility(id: number, input: AbilityInput) {
    return abilityRepository.update(id, input);
  },

  removeAbility(id: number) {
    return abilityRepository.remove(id);
  }
};