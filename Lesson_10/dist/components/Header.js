import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
export const Header = () => (_jsx("header", { children: _jsxs("nav", { children: [_jsx("a", { href: "/", children: "AgentClinic" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/agents", children: "Agents" }) }), _jsx("li", { children: _jsx("a", { href: "/ailments", children: "Ailments" }) })] })] }) }));
