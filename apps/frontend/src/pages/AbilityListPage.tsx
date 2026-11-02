
import { useState } from "react";
import type { SubmitEvent } from "react";

import { useAbilities } from "../hooks/useAbilities";
import type { Ability, AbilityInput } from "../types/Monster";
import "./AbilityListPage.css";

interface AbilityRowProps {
  ability: Ability;
  onSave: (id: number, input: AbilityInput) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

function AbilityRow({
  ability,
  onSave,
  onDelete
}: AbilityRowProps) {
  const [name, setName] = useState(ability.name);
  const [description, setDescription] =
    useState(ability.description ?? "");
  const [saving, setSaving] = useState(false);

async function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    await onSave(ability.id, { name, description });
    setSaving(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${ability.name}"?`)) {
      return;
    }

    setSaving(true);
    await onDelete(ability.id);
    setSaving(false);
  }

  return (
    <li className="ability-row">
      <form onSubmit={handleSave}>
        <div>
          <label htmlFor={`ability-name-${ability.id}`}>
            Name
          </label>
          <input
            id={`ability-name-${ability.id}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor={`ability-description-${ability.id}`}>
            Description
          </label>
          <textarea
            id={`ability-description-${ability.id}`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={500}
            rows={2}
          />
        </div>

        <div className="ability-actions">
          <button type="submit" disabled={saving}>
            Save
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => void handleDelete()}
          >
            Delete
          </button>
        </div>
      </form>
    </li>
  );
}

export function AbilityListPage() {
  const {
    abilities,
    loading,
    error,
    addAbility,
    updateAbility,
    removeAbility
  } = useAbilities();

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setAdding(true);

    const added = await addAbility({
      name: newName,
      description: newDescription
    });

    setAdding(false);

    if (added) {
      setNewName("");
      setNewDescription("");
    }
  }

  return (
    <section className="ability-admin">
      <h1>Manage Abilities</h1>

      <h2>Add Ability</h2>
      <form className="add-ability-form" onSubmit={handleAdd}>
        <div>
          <label htmlFor="new-ability-name">Name</label>
          <input
            id="new-ability-name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="new-ability-description">
            Description
          </label>
          <textarea
            id="new-ability-description"
            value={newDescription}
            onChange={(event) =>
              setNewDescription(event.target.value)
            }
            maxLength={500}
            rows={2}
          />
        </div>

        <button type="submit" disabled={adding}>
          {adding ? "Adding..." : "Add Ability"}
        </button>
      </form>

      <h2>Existing Abilities</h2>

      {error && (
        <p className="errors" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading abilities...</p>
      ) : abilities.length === 0 ? (
        <p>No abilities found.</p>
      ) : (
        <ul className="ability-list">
          {abilities.map((ability) => (
            <AbilityRow
              key={ability.id}
              ability={ability}
              onSave={updateAbility}
              onDelete={removeAbility}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
