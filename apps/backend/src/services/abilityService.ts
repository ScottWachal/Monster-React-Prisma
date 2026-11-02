import { abilityRepository } from "../repositories/abilityRepository";

export const abilityService = {
  getAll() {
    return abilityRepository.getAll();
  }
};