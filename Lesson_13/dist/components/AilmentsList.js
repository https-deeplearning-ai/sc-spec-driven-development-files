import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Layout } from "./Layout";
export const AilmentsList = ({ ailments }) => (_jsxs(Layout, { children: [_jsx("h1", { children: "Ailments" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "Name" }), _jsx("th", { scope: "col", children: "Description" })] }) }), _jsx("tbody", { children: ailments.map((a) => (_jsxs("tr", { children: [_jsx("td", { children: a.name }), _jsx("td", { children: a.description })] }, a.id))) })] })] }));
