import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type Database from "better-sqlite3";
import { Login } from "../components/Login";
import { verifyPassword } from "../auth/password";
import { createSession, destroySession, getSession } from "../auth/session";
import { SESSION_COOKIE } from "../middleware/auth";
import type { StaffCredential } from "../db/types";

const isProduction = process.env.NODE_ENV === "production";

export function authRouter(db: Database.Database) {
  const router = new Hono();

  const selectStaff = db.prepare(
    "SELECT * FROM staff_credentials WHERE username = ?"
  );

  router.get("/login", (c) => {
    const sessionId = getCookie(c, SESSION_COOKIE);
    if (sessionId && getSession(db, sessionId)) {
      return c.redirect("/dashboard");
    }
    return c.html(<Login />);
  });

  router.post("/login", async (c) => {
    const body = await c.req.parseBody();
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");

    const staff = selectStaff.get(username) as StaffCredential | undefined;
    const valid = staff ? verifyPassword(password, staff.password_hash) : false;

    if (!valid) {
      return c.html(
        <Login error="Invalid username or password." username={username} />
      );
    }

    const sessionId = createSession(db);
    setCookie(c, SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "Lax",
      secure: isProduction,
      path: "/",
    });
    return c.redirect("/dashboard");
  });

  router.post("/logout", (c) => {
    const sessionId = getCookie(c, SESSION_COOKIE);
    if (sessionId) destroySession(db, sessionId);
    deleteCookie(c, SESSION_COOKIE, { path: "/" });
    return c.redirect("/login");
  });

  return router;
}
