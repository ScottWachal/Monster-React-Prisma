import {
  Navigate,
  Route,
  Routes,
} from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { MonsterListPage } from "./pages/MonsterListPage";
import { MonsterDetailsPage } from "./pages/MonsterDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";


export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={ <Navigate to="/monsters" replace /> } />

        <Route
          path="monsters"
          element={<MonsterListPage />}
        />

        <Route
          path="monster/:id"
          element={<MonsterDetailsPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>
    </Routes>
  );
}