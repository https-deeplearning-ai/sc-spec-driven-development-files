# AgentClinic Tech Stack

## Core Technologies
- **Language**: TypeScript (Type safety across the full stack)
- **Framework**: Hono (Lightweight, fast web framework for API and Server-Side Rendering)
- **Frontend**: React (with Vite for fast development and bundling)
- **Styling**: Vanilla CSS (for clean, modern aesthetics as requested by Steve)
- **Database**: SQLite (via `better-sqlite3`) - Zero-config, file-based persistence. It provides a portable, single-file database that is perfect for course portability and conference demos.
- **ORM**: Drizzle ORM (Type-safe SQL with zero runtime overhead)
- **LLM Integration**: Anthropic SDK (for triage, diagnosis, and prescription generation)

## Architecture
- **API Surface**: REST API for agent registration, visits, and follow-ups.
- **Dashboard**: Web interface for operators to view patient history and clinic analytics.
- **Persistence**: SQLite database storing patients, visits, ailments, and treatment effectiveness data.
- **Real-time**: SSE (Server-Sent Events) for live dashboard updates.

## Key Components
- **Diagnosis Engine**: Sequential LLM calls for triage and treatment selection.
- **Follow-up Processor**: Logic to update treatment effectiveness based on outcome reports.
- **Background Jobs**: For visit expiration and chronic condition detection.
