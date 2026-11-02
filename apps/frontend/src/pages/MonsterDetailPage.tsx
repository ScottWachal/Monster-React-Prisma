import {
  useNavigate,
  useParams,
} from "react-router";

import { useMonster } from "../hooks/useMonster";
import "./MonsterDetailsPage.css";

export function MonsterDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const parsedId = Number(id);

  const monsterId =
    Number.isInteger(parsedId) && parsedId > 0
      ? parsedId
      : undefined;

  const {
    monster,
    loading,
    error,
    removeMonster,
  } = useMonster(monsterId);

  async function handleRemove() {
    const removed = await removeMonster();

    if (removed) {
      navigate("/monsters");
    }
  }

  if (loading) {
    return <p>Loading monster...</p>;
  }

  if (error) {
    return <p className="errors" role="alert">{error}</p>;
  }

  if (!monster) {
    return <p>Monster not found.</p>;
  }

  return (
    <section className="monster-details">
      <h1>{monster.name}</h1>

      <dl>
        <dt>ID</dt>
        <dd>{monster.id}</dd>

        <dt>Name</dt>
        <dd>{monster.name}</dd>

        <dt>Level</dt>
        <dd>{monster.level}</dd>

        <dt>Hit Points</dt>
        <dd>{monster.hitPoints}</dd>

        <dt>Description</dt>
        <dd>
          {monster.description ??
            "No description provided."}
        </dd>
      </dl>
      <h2>Abilities</h2>

      {monster.abilities.length === 0 ? (
        <p>This monster has no abilities.</p>
      ) : (
        <ul>
          {monster.abilities.map((ability) => (
            <li key={ability.id}>
              <strong>{ability.name}</strong>
              {ability.description && (
                <p>{ability.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => {
          void handleRemove();
        }}
      >
        Remove Monster
      </button>
    </section>
  );
}