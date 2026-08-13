# AgentClinic

## Input from stakeholders

- Mary in engineering wants a reliable site with a popular stack based on TypeScript, giving agents and staff a dashboard for easy access.
- Susan in product has a set of features about agents and their ailments, therapies, and booking appointments.
- Steve in marketing wants an attractive site that works well with a modern browser.

## Staff login

`/dashboard` requires a staff login. The seed script (`npm run seed`, and dev server startup) creates one staff account from these environment variables:

| Env var | Default | Notes |
|---|---|---|
| `STAFF_USERNAME` | `staff` | |
| `STAFF_PASSWORD` | `changeme` | **Set this before seeding a real deployment.** The default is for local development/demos only, and a warning is logged when it's used. |

The password is hashed (scrypt, salted) before it's stored — the plaintext is never written to the database.