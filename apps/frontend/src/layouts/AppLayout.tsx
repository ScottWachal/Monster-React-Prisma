import {
  NavLink,
  Outlet,
} from "react-router";

export function AppLayout() {
  return (
    <>
      <header>
        <h1>Monster Manager</h1>

        <nav>
          <NavLink to="/monsters">
            Monsters
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>Monster Manager</p>
      </footer>
    </>
  );
}