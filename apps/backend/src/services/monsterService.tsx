import { monsterRepository } from "../repositories/monsterRepository";
import type { CreateMonsterInput } from "../types/Monster";

export const monsterService = {
  getAll() {
    return monsterRepository.getAll();
  },

  getById(id: number) {
    return monsterRepository.getById(id);
  },

  add(input: CreateMonsterInput) {
    return monsterRepository.add(input);
  },

  remove(id: number) {
    return monsterRepository.remove(id);
  }
};