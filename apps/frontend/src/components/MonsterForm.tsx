import { useState } from "react";
import type { CreateMonsterInput } from "../types/Monster";

interface MonsterFormProps {
  onAdd: (
    monster: CreateMonsterInput,
  ) => Promise<boolean>;
}

export function MonsterForm({
  onAdd,
}: MonsterFormProps) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [hitPoints, setHitPoints] = useState(5);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);

    const added = await onAdd({
      name,
      level,
      hitPoints,
      description,
    });

    setSaving(false);

    if (added) {
      setName("");
      setLevel(1);
      setHitPoints(5);
      setDescription("");
    }
  }

  return (
    <form className="monster-form" onSubmit={handleSubmit}>
      <h2>Add Monster</h2>

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          minLength={2}
          required
        />
      </div>

      <div>
        <label htmlFor="level">Level</label>
        <input
          id="level"
          type="number"
          value={level}
          onChange={(event) =>
            setLevel(Number(event.target.value))
          }
          min={1}
          max={20}
          required
        />
      </div>

      <div>
        <label htmlFor="hitPoints">
          Hit Points
        </label>
        <input
          id="hitPoints"
          type="number"
          value={hitPoints}
          onChange={(event) =>
            setHitPoints(Number(event.target.value))
          }
          min={0}
          required
        />
      </div>

      <div>
        <label htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "Adding..." : "Add Monster"}
      </button>
    </form>
  );
}