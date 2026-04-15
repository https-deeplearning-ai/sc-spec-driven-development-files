import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Layout } from "../components/Layout";
export const NotFound = () => (_jsx(Layout, { children: _jsxs("article", { children: [_jsx("header", { children: _jsx("h1", { children: "Page Not Found" }) }), _jsx("p", { children: "The page you're looking for doesn't exist." }), _jsx("a", { href: "/", children: "\u2190 Return home" })] }) }));
