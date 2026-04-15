import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Layout } from "../components/Layout";
export const ServerError = () => (_jsx(Layout, { children: _jsxs("article", { children: [_jsx("header", { children: _jsx("h1", { children: "Something Went Wrong" }) }), _jsx("p", { children: "An unexpected error occurred. Please try again later." }), _jsx("a", { href: "/", children: "\u2190 Return home" })] }) }));
