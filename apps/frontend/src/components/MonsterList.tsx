import { useEffect } from "react";
import type { Monster } from "../types/Monster";
import { MonsterListItem } from "./MonsterListItem";

interface MonsterListProps {
  monsters: Monster[];
  onRemove: (id: number) => Promise<boolean>;
}

export function MonsterList({
  monsters,
  onRemove,
}: MonsterListProps) {
  if (monsters.length === 0) {
    return <p className="errors">No monsters found.</p>;
  }

  useEffect(() => { 
      console.log("MonsterList mounted");
      return () => {
          console.log("MonsterList unmounted");
      }
  }, []);
  
  return (
    <ul className="monster-list">
      {monsters.map((monster) => (
        <MonsterListItem
          key={monster.id}
          monster={monster}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}