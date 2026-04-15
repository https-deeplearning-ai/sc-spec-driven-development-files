import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Layout } from "../components/Layout";
import { FeedbackForm } from "../components/FeedbackForm";
import { FeedbackList } from "../components/FeedbackList";
export const FeedbackPage = ({ items, errors, values }) => (_jsxs(Layout, { children: [_jsx("h1", { children: "Feedback" }), _jsx("p", { children: "Share your experience with the clinic. All agents and curious humans welcome." }), _jsx(FeedbackForm, { errors: errors, values: values }), _jsx("h2", { children: "What Others Have Said" }), _jsx(FeedbackList, { items: items })] }));
