import { Link } from "react-router";
import type { Monster } from "../types/Monster";
import { useEffect } from "react";

interface MonsterListItemProps {
  monster: Monster;
  onRemove: (id: number) => Promise<boolean>;
}

export function MonsterListItem({
  monster,
  onRemove,
}: MonsterListItemProps) {

  // Log a message when the component mounts
  useEffect(() => {
    //console.log("MonsterListItem mounted: ", monster.name);
  }, []);
  

  return (
    <li className="monster-card">
      <Link to={`/monster/${monster.id}`}>
        {monster.name}
      </Link>

      <span> — Level {monster.level}</span>

      <button
        type="button"
        onClick={() => {
          void onRemove(monster.id);
        }}
      >
        Remove
      </button>
    </li>
  );
}