import {FC} from "hono/jsx";

export const Header: FC = () => (
    <header>
        <a href="/"><strong>AgentClinic</strong></a>
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/agents">Agents</a></li>
                <li><a href="/ailments">Ailments</a></li>
            </ul>
        </nav>
    </header>
);
