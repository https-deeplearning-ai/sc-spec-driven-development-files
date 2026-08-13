import {FC} from "hono/jsx";

export const Header: FC = () => (
  <header>
    <nav>
      <a href="/">AgentClinic</a>
      <ul>
        <li>
          <a href="/agents">Agents</a>
        </li>
        <li>
          <a href="/ailments">Ailments</a>
        </li>
        <li>
          <a href="/therapies">Therapies</a>
        </li>
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
      </ul>
    </nav>
  </header>
);