import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section>
      <h1>Page Not Found</h1>

      <p>
        <Link to="/monsters">
          Return to monsters
        </Link>
      </p>
    </section>
  );
}