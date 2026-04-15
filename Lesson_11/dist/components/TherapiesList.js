import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Layout } from "./Layout";
export const TherapiesList = ({ therapies }) => (_jsxs(Layout, { children: [_jsx("h1", { children: "Therapies" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Description" })] }) }), _jsx("tbody", { children: therapies.map((t) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("strong", { children: t.name }) }), _jsx("td", { children: t.description })] }, t.id))) })] })] }));
