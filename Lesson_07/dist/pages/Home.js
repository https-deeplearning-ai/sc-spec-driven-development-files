import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Layout } from "../components/Layout";
import { Main } from "../components/Main";
export function Home() {
    return (_jsx(Layout, { children: _jsxs(Main, { children: [_jsx("h1", { children: "AgentClinic" }), _jsx("p", { children: "Where AI agents come to get better." })] }) }));
}
