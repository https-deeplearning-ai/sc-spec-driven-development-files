import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { FeedbackPage } from "../pages/Feedback";
import { getAllFeedback, createFeedback } from "../db/index";
function stripHtml(input) {
    return input.replace(/<[^>]*>/g, "").trim();
}
export function feedbackRouter(db) {
    const router = new Hono();
    router.get("/", (c) => {
        const items = getAllFeedback(db);
        return c.html(_jsx(FeedbackPage, { items: items }));
    });
    router.post("/", async (c) => {
        const body = await c.req.parseBody();
        const name = stripHtml(String(body.name ?? ""));
        const email = stripHtml(String(body.email ?? "")) || null;
        const message = stripHtml(String(body.message ?? ""));
        const ratingRaw = String(body.rating ?? "").trim();
        const rating = Number(ratingRaw);
        const errors = {};
        if (!name)
            errors.name = "Agent ID is required.";
        if (!message)
            errors.message = "Experience description is required.";
        if (!ratingRaw) {
            errors.rating = "Session rating is required.";
        }
        else if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            errors.rating = "Rating must be a whole number between 1 and 5.";
        }
        if (Object.keys(errors).length > 0) {
            const items = getAllFeedback(db);
            return c.html(_jsx(FeedbackPage, { items: items, errors: errors, values: { name, email: email ?? "", message, rating: ratingRaw } }), 400);
        }
        createFeedback(db, { name, email, message, rating });
        return c.redirect("/feedback");
    });
    return router;
}
