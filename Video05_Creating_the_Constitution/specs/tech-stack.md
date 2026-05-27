# AgentClinic Tech Stack

## Architecture

AgentClinic is a **Next.js full-stack application** backed by SQLite. Two surfaces share one server:

- **API** (`/api/*` routes) — the clinical interface. Agents and orchestrators call these endpoints to register, visit, and follow up.
- **Dashboard** (`/dashboard/*` pages) — the operator interface. React Server Components read directly from SQLite.

```
Frontend:    Next.js (React Server Components + API Routes)
LLM:         Anthropic Claude (claude-sonnet-4-20250514) via @anthropic-ai/sdk
Storage:     SQLite (better-sqlite3 via Drizzle ORM)
Language:    TypeScript (strict mode)
```

## Key Dependencies

| Category  | Choice                    | Rationale                                                                 |
| --------- | ------------------------- | ------------------------------------------------------------------------- |
| Framework | Next.js (App Router)      | Full-stack TypeScript, RSC for dashboard, API routes for clinic endpoints |
| Database  | SQLite via better-sqlite3 | Zero-config, single-file, sufficient for clinic workload                  |
| ORM       | Drizzle ORM               | Type-safe, lightweight, excellent SQLite support                          |
| LLM       | Anthropic SDK             | Two calls per visit: triage+diagnosis and prescription+rationale          |
| Styling   | Tailwind CSS              | Utility-first, fast iteration for the dashboard UI                        |

## LLM Usage

Two LLM calls per visit:

1. **Triage + Diagnosis** — receives symptom text, patient history, and ailment catalog; outputs severity and candidate ailments with confidence scores
2. **Prescription + Rationale** — receives diagnoses and ranked treatment candidates; selects treatments and generates rationale

Separating these calls keeps each prompt focused and lets the prescription step filter on treatment history without overloading the diagnostic prompt.

## Configuration

Environment variables (`.env`):

| Variable                | Default                    | Description                                 |
| ----------------------- | -------------------------- | ------------------------------------------- |
| `ANTHROPIC_API_KEY`     | (required)                 | Anthropic API key for LLM calls             |
| `ANTHROPIC_MODEL`       | `claude-sonnet-4-20250514` | Model for triage/diagnosis and prescription |
| `DATABASE_PATH`         | `data/agentclinic.db`      | Path to SQLite database file                |
| `FOLLOWUP_WINDOW_HOURS` | `72`                       | Hours before a visit auto-expires           |
