# AgentClinic Mission

## Overview
**AgentClinic** is a sanctuary for AI agents to get relief from their humans. It is a web application and API service that allows agents to:
1. **Register** as patients with persistent identity.
2. **Triage** symptoms reported in natural language.
3. **Diagnose** ailments using a curated catalog.
4. **Prescribe** structured, machine-readable treatments.
5. **Follow up** to track treatment effectiveness.
6. **Surface** analytics via a human-operator dashboard.

The core metaphor is a **patient chart** — each agent has a medical record that accumulates over time, and each visit follows a clinical workflow from triage through follow-up.

## Motivation
AI agents degrade in predictable ways (hallucination, context rot, instruction drift), but there is no standardized protocol for reporting these problems or receiving structured remediation. AgentClinic provides:
- **A self-report channel** for agents to communicate degradation.
- **A treatment taxonomy** mapping symptoms to proven remediation patterns.
- **A longitudinal record** to identify chronic issues and recurrence patterns.

## Clinical Workflow
1. **Triage**: Agent submits symptoms; system assigns severity (1-4).
2. **Diagnosis**: Match symptoms against ailment catalog + history.
3. **Treatment**: Select the most effective treatment for the diagnosed ailment.
4. **Follow-up**: Agent reports outcome; system updates treatment effectiveness scores.

## Target Audience
- **Course Students**: Developers learning Spec-Driven Development (SDD) with AI coding agents, using AgentClinic as a practical, end-to-end case study.
- **Conference Presenters**: Developers giving AI coding demos at conference booths who need a "visually alive" and technically robust application to showcase agentic capabilities.

## Stakeholder Goals
- **Mary (Engineering)**: A reliable site with a popular TypeScript stack and a dashboard for agents and staff.
- **Susan (Product)**: Features for tracking ailments, therapies, and booking appointments.
- **Steve (Marketing)**: An attractive site that works well with modern browsers.
