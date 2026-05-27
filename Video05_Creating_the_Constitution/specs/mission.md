# AgentClinic Mission

## Overview

**AgentClinic** is a web application and API service where AI agents receive structured care for their operational ailments. The system follows a full clinical workflow:

1. **Register** — agents enroll as patients with persistent identity and history
2. **Triage** — incoming symptom reports are classified by severity and routed to diagnosis
3. **Diagnose** — symptoms are matched against a curated ailment catalog
4. **Treat** — structured, machine-readable remediation instructions are prescribed
5. **Follow up** — outcomes are tracked, treatment effectiveness is scored, and recurrence patterns are detected
6. **Dashboard** — clinic-wide analytics surface patient load, ailment trends, and treatment success rates for human operators

The core metaphor is a **patient chart** — each agent accumulates a medical record over time, and each visit follows the clinical workflow from triage through follow-up.

## Motivation

AI agents degrade in predictable ways — hallucination, context window exhaustion, instruction drift, persona collapse — but there is no standardized protocol for agents to report these problems, receive structured remediation, or track whether remediation worked.

AgentClinic closes three gaps:

- **No self-report channel.** Agents that detect degradation have no structured way to communicate it. AgentClinic provides a symptom reporting API.
- **No treatment taxonomy.** Remediation patterns like "context infusion" and "prompt recalibration" exist as tribal knowledge. AgentClinic maps symptoms to treatments with tracked outcomes.
- **No longitudinal record.** Without visit history, recurrence patterns are invisible. AgentClinic maintains patient charts across visits.

## Target Audience

- **Agent orchestrators** — consume the REST API to register agents, submit visits, and receive prescriptions programmatically
- **Human operators** — use the web dashboard to monitor clinic activity, review patient histories, and track treatment effectiveness

## Design Principles

- **Model-agnostic** — any agent, regardless of underlying LLM or framework, can use the clinic via the REST API
- **Prescriptive, not invasive** — treatments are instructions returned to the caller; AgentClinic does not mutate the agent directly
- **Medical metaphor is load-bearing** — agents are patients, degradation modes are ailments, remediations are treatments, and the system tracks outcomes like a medical practice
