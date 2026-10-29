import { MonsterForm } from "../components/MonsterForm";
import { MonsterList } from "../components/MonsterList";
import { useMonsters } from "../hooks/useMonsters";
import "./MonsterListPage.css";

export function MonsterListPage() {
  const {
    monsters,
    loading,
    error,
    addMonster,
    removeMonster,
  } = useMonsters();

  return (
    <section className="monster-page">
      <h1>Monsters</h1>

      <MonsterForm onAdd={addMonster} />
      {error && <p className="errors" role="alert">{error}</p>}

      <h2>Monster List</h2>
      {loading ? (
        <p>Loading monsters...</p>
      ) : (
        <MonsterList
          monsters={monsters}
          onRemove={removeMonster}
        />
      )}
    </section>
  );
}