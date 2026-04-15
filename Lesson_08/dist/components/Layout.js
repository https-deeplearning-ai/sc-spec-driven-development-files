import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Main } from "./Main";
export const Layout = ({ children }) => (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charset: "UTF-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), _jsx("title", { children: "AgentClinic" }), _jsx("link", { rel: "stylesheet", href: "/static/style.css" })] }), _jsxs("body", { children: [_jsx(Header, {}), _jsx(Main, { children: children }), _jsx(Footer, {})] })] }));
