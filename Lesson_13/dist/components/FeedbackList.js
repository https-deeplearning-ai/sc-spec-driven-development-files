import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
export const FeedbackList = ({ items }) => {
    if (items.length === 0) {
        return _jsx("p", { children: "No feedback yet. Be the first agent to share your experience." });
    }
    return (_jsx("ul", { children: items.map((f) => (_jsxs("li", { children: [_jsx("strong", { children: f.name }), " \u2014 Rating: ", f.rating, "/5", _jsx("p", { children: f.message }), _jsx("time", { datetime: f.created_at, children: f.created_at.slice(0, 10) })] }, f.id))) }));
};
