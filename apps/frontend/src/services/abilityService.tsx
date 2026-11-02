import { abilityRepository } from "../repositories/abilityRepository";

export const abilityService = {
  getAbilities() {
    return abilityRepository.getAll();
  }
};