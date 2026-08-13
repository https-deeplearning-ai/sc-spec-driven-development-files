import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import type Database from "better-sqlite3";
import { getSession } from "../auth/session";

export const SESSION_COOKIE = "session_id";

/**
 * Gates a route behind a valid staff session. Redirects to /login when the
 * session_id cookie is missing or doesn't match a live session row.
 */
export function requireStaffAuth(db: Database.Database) {
  return createMiddleware(async (c, next) => {
    const sessionId = getCookie(c, SESSION_COOKIE);
    if (!sessionId || !getSession(db, sessionId)) {
      return c.redirect("/login");
    }
    await next();
  });
}
