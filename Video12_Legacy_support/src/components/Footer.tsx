import { FC } from "hono/jsx";

export const Footer: FC = () => (
  <footer aria-label="Site footer">
    <p>&copy; {new Date().getFullYear()} AgentClinic</p>
    <p>
      <a href="/login">Staff Login</a>
    </p>
  </footer>
);
