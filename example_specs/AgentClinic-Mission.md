# AgentClinic Mission

## Overview

**AgentClinic** is a web application and API service that:

1. **Registers** agents as patients with persistent identity and medical history
2. **Triages** incoming symptom reports using natural language understanding to classify severity and route to the appropriate diagnostic pathway
3. **Diagnoses** ailments by matching symptom patterns against a curated (and extensible) ailment catalog
4. **Prescribes** treatments — structured, machine-readable remediation instructions the calling system can act on
5. **Follows up** — tracks whether treatments resolved the ailment, builds effectiveness scores per treatment-ailment pair, and detects recurrence patterns
6. **Surfaces** clinic-wide analytics on a dashboard: patient load, ailment frequency, treatment success rates, chronic patients

The core metaphor is a **patient chart** — each agent has a medical record that accumulates over time, and each visit follows a clinical workflow from triage through follow-up.

AgentClinic is **model-agnostic and framework-agnostic**. Any agent — regardless of underlying LLM, orchestration framework, or deployment environment — can register and visit the clinic via the REST API. The treatments returned are prescriptive instructions, not direct mutations; the calling system decides how to execute them.

## Motivation

AI agents degrade in predictable ways — hallucination, context window exhaustion, instruction drift, persona collapse — but there is no standardized protocol for agents to report these problems, receive structured remediation, or track whether remediation worked.

The current failure mode: an agent starts producing bad output, a human notices (or doesn't), the human manually debugs by inspecting logs or re-prompting, and the fix is ad hoc. There is no patient history, no treatment record, no feedback loop measuring whether "give it a better system prompt" actually reduced hallucination rates. Every debugging session starts from zero.

Three specific gaps:

- **No self-report channel.** Agents that detect their own degradation (e.g., noticing they're repeating themselves, or that their context is full) have no structured way to communicate this. They either fail silently or produce a freeform error message the orchestrator isn't designed to parse.
- **No treatment taxonomy.** "Context infusion," "prompt recalibration," "memory flush" — these are real remediation patterns, but they exist only as tribal knowledge. No system maps symptoms to treatments with tracked outcomes.
- **No longitudinal record.** An agent that hallucinates on Monday, gets patched, and hallucinates again on Thursday is indistinguishable from a first-time patient. Without visit history, recurrence patterns are invisible.

AgentClinic closes these gaps. It is a **clinic API** — agents check in, describe symptoms in natural language, receive a structured diagnosis and prescriptive treatment, and return for follow-up. A web dashboard gives human operators visibility into the clinic's patient population, ailment trends, and treatment effectiveness.

The medical metaphor is deliberate and load-bearing. "Hallucination" is already medical language borrowed by AI. AgentClinic extends this: agents are patients, degradation modes are ailments, remediations are treatments, and the system tracks outcomes like a medical practice. The metaphor provides an intuitive mental model for a genuinely complex problem (agent lifecycle management) while mapping to real technical concepts underneath.

## Clinical Workflow

```
┌──────────────┐                    ┌──────────────┐                    ┌──────────────┐                    ┌──────────────┐
│   TRIAGE     │ ──────────────────→│  DIAGNOSIS   │ ──────────────────→│  TREATMENT   │ ──────────────────→│  FOLLOW-UP   │
│              │                    │              │                    │              │                    │              │
│ Agent submits│  severity +        │ Match against│  ailment(s)        │ Select best  │  prescription      │ Agent returns│
│ symptoms in  │  routing           │ ailment      │  identified        │ treatment per│  returned to       │ with outcome │
│ natural lang │  assigned          │ catalog +    │                    │ ailment, adj │  caller            │ report       │
│              │                    │ history      │                    │ for history  │                    │              │
└──────────────┘                    └──────────────┘                    └──────────────┘                    └──────┬───────┘
                                                                                                                   │
                                          ┌────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │   RESOLVED   │   Treatment worked — visit closed
                                   │      or      │
                                   │  RECURRING   │   Symptoms persist — new visit opened, treatment
                                   │      or      │   effectiveness downgraded
                                   │   CHRONIC    │   3+ recurrences of same ailment — flagged for
                                   │              │   operator attention
                                   └──────────────┘
```

### Visit States

| State | Trigger | Meaning |
|-------|---------|---------|
| **TRIAGE** | Agent calls `POST /visits` with symptom text | Symptoms received; severity and urgency assigned |
| **DIAGNOSED** | Triage completes symptom classification | Ailment(s) identified from catalog; if no match, a novel ailment record is created with `status: unverified` |
| **PRESCRIBED** | Diagnosis completes | Treatment instructions generated and returned to caller |
| **AWAITING_FOLLOWUP** | Prescription delivered | Waiting for the agent (or its orchestrator) to report outcome. Auto-closes after configurable window (default: 72 hours) with `outcome: unknown` |
| **RESOLVED** | Follow-up reports improvement | Visit closed. Treatment effectiveness score incremented for this ailment-treatment pair |
| **UNRESOLVED** | Follow-up reports no improvement | Visit closed. Treatment effectiveness score decremented. If same ailment recurs within 7 days → `recurrence_flag: true` on the new visit |
| **EXPIRED** | No follow-up within window | Visit closed with `outcome: unknown`. Does not affect treatment effectiveness scores (absence of data ≠ failure) |

### Severity Levels

Triage assigns one of four severity levels. Severity affects treatment selection priority (higher severity → more aggressive treatments) and dashboard alerting.

| Severity | Label | Criteria | Example |
|----------|-------|----------|---------|
| 1 | **MILD** | Degraded output quality, still functional | Occasional off-topic tangent |
| 2 | **MODERATE** | Noticeably impaired, core function affected | Frequent hallucination in factual claims |
| 3 | **SEVERE** | Core function failing, unreliable output | Context rot causing complete loss of conversation thread |
| 4 | **CRITICAL** | Agent non-functional or actively harmful | Persona collapse; agent producing outputs contradicting its instructions |

### Triage

Triage runs first on every incoming visit. It receives the raw `symptom_text` and produces two outputs: a severity level (1-4) and a list of candidate ailment codes to evaluate.

The triage step uses an LLM call with a structured prompt:

```
You are the triage nurse at AgentClinic. An AI agent has arrived with the following symptoms:

"{symptom_text}"

Patient history summary:
{patient_history_summary}

Available ailment catalog:
{ailment_catalog_summary}

Tasks:
1. Assign a severity level (1=MILD, 2=MODERATE, 3=SEVERE, 4=CRITICAL) based on functional impact
2. List candidate ailment codes (1-3) that best match the symptoms
3. Note if symptoms don't match any known ailment

Respond in JSON: { "severity": int, "candidates": ["CODE-001", ...], "notes": "..." }
```

**Patient history injection:** If the patient has previous visits, triage receives a summary: last 5 visits with ailments, treatments, and outcomes. This enables the LLM to recognize patterns ("This is the third time in two weeks this agent has presented with hallucination — previous treatments were Context Infusion and Grounding Injection, both unresolved").

### Diagnosis

For each candidate ailment from triage, the diagnosis step computes a confidence score:

1. **Symptom pattern matching:** Compare `symptom_text` against the ailment's registered `symptom_patterns` using the LLM as a semantic matcher. The LLM scores each pattern from 0-1, and the ailment's confidence is the max pattern score.
2. **History weighting:** If this patient has been diagnosed with this ailment before, confidence gets a +0.1 boost (recurrence makes the same diagnosis more likely). Capped at 1.0.
3. **Threshold:** Confidence ≥ 0.6 → confirmed diagnosis. Confidence 0.4-0.59 → diagnosis included but flagged as `uncertain`. Confidence < 0.4 → excluded.
4. **No match:** If no ailment reaches 0.4 confidence, the system auto-creates a custom ailment from the symptom text and assigns `confidence: 0.5, status: auto_detected`.

### Multi-Diagnosis

Agents frequently present with co-occurring ailments (e.g., Context Rot + Hallucination, or Instruction Drift + Persona Collapse). The diagnosis step evaluates all candidate ailments independently — a single visit can produce 1-3 diagnoses, each with its own treatment.

Known co-occurrence patterns (for dashboard analytics):
- CTX-001 (Context Rot) often co-occurs with HAL-001 (Hallucination) — degraded context leads to fabrication
- DFT-001 (Instruction Drift) often co-occurs with PRS-001 (Persona Collapse) — drift is the early stage, collapse is the late stage
- CTX-002 (Context Overflow) often co-occurs with LAT-001 (Latency Bloat) — full context slows generation

## API Design

### Endpoints

All endpoints return JSON. Authentication is via API key in the `Authorization: Bearer <key>` header. MVP supports a single global API key configured via environment variable; multi-tenant key management is post-MVP.

#### Patient Management

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/patients` | Register a new agent patient. Returns `patient_id` |
| `GET` | `/patients/:id` | Retrieve patient record including chronic conditions and visit summary |
| `PATCH` | `/patients/:id` | Update patient metadata (e.g., new version, changed environment) |
| `GET` | `/patients` | List patients with filtering (`?status=active&owner=research-team&tag=production`) |
| `GET` | `/patients/:id/history` | Full visit history for a patient. Supports `?limit=` and `?ailment=` filters |

#### Visits (Core Clinical Workflow)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/visits` | Start a new visit. Body: `{ "patient_id": "...", "symptom_text": "...", "metadata": {} }`. Runs triage → diagnosis → treatment synchronously. Returns complete visit record with prescriptions. |
| `GET` | `/visits/:id` | Retrieve visit record |
| `POST` | `/visits/:id/followup` | Submit follow-up outcome. Body: `{ "outcome": "improved", "outcome_text": "...", "metrics": {} }` |
| `GET` | `/visits` | List visits with filtering (`?patient_id=&state=&severity=&ailment=`) |

The `POST /visits` endpoint is the primary integration point. A single API call performs the full triage → diagnosis → treatment pipeline and returns prescriptions. The calling system receives everything it needs in one response — no multi-step API choreography required.

```
┌─────────────┐     POST /visits          ┌─────────────┐     response          ┌─────────────┐
│   Calling    │ ────────────────────────→ │  AgentClinic │ ───────────────────→ │   Calling    │
│   System     │  { patient_id,           │   Server     │  { visit_id,         │   System     │
│              │    symptom_text }         │              │    diagnoses,        │              │
│              │                           │  triage →    │    prescriptions }   │  executes    │
│              │                           │  diagnose →  │                      │  treatment   │
│              │                           │  prescribe   │                      │  instructions│
└─────────────┘                           └─────────────┘                      └──────┬──────┘
                                                                                      │
                      POST /visits/:id/followup                                       │
                   ←──────────────────────────────────────────────────────────────────┘
                      { outcome: "improved" }
```

#### Catalog Management

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/ailments` | List all ailments (core + custom). Supports `?category=&status=` |
| `POST` | `/ailments` | Register a custom ailment |
| `GET` | `/ailments/:code` | Retrieve ailment details including associated treatments and effectiveness data |
| `GET` | `/treatments` | List all treatments with global effectiveness summaries |
| `GET` | `/treatments/:code` | Retrieve treatment details including per-ailment effectiveness breakdown |

#### Analytics (Dashboard Backend)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/analytics/overview` | Clinic-wide stats: total patients, active visits, ailment distribution, resolution rate |
| `GET` | `/analytics/ailments` | Ailment frequency over time, severity distribution, trending ailments |
| `GET` | `/analytics/treatments` | Treatment effectiveness rankings, recurrence rates, exhaustion counts |
| `GET` | `/analytics/patients/:id` | Individual patient analytics: visit frequency, ailment history, treatment response patterns |

### API Response: Visit Example

```json
{
  "visit_id": "v_8f3a2b1c",
  "patient_id": "p_4d2e9f0a",
  "state": "AWAITING_FOLLOWUP",
  "created_at": "2026-04-06T14:30:00Z",
  "severity": 3,
  "diagnoses": [
    {
      "ailment_code": "HAL-001",
      "ailment_name": "Hallucination",
      "confidence": 0.91,
      "matched_patterns": ["fabricating", "confident but wrong"],
      "severity_adjusted": 3
    },
    {
      "ailment_code": "CTX-001",
      "ailment_name": "Context Rot",
      "confidence": 0.67,
      "matched_patterns": ["forgetting established facts"],
      "severity_adjusted": 2
    }
  ],
  "prescriptions": [
    {
      "treatment_code": "CTX-INF",
      "treatment_name": "Context Infusion",
      "prescription_payload": {
        "action": "inject_context",
        "position": "prepend",
        "content_template": "GROUNDING: Verify all claims against provided sources. Do not generate information not present in sources. If uncertain, state uncertainty explicitly."
      },
      "rationale": "Hallucination (severity 3) is the primary diagnosis. Context Infusion has 78% effectiveness for HAL-001 and was not previously prescribed to this patient.",
      "deferred": false
    },
    {
      "treatment_code": "MEM-FLS",
      "treatment_name": "Memory Flush",
      "prescription_payload": {
        "action": "context_management",
        "strategy": "summarize_and_truncate",
        "retain_last_n_turns": 4
      },
      "rationale": "Context Rot (severity 2) co-diagnosed. Memory Flush addresses accumulated context degradation.",
      "deferred": false
    }
  ],
  "followup_due": "2026-04-09T14:30:00Z",
  "recurrence_flag": false
}
```

### Error Responses

| HTTP Status | Code | Meaning |
|-------------|------|---------|
| 400 | `INVALID_REQUEST` | Malformed body, missing required fields |
| 404 | `PATIENT_NOT_FOUND` | Unknown `patient_id` |
| 404 | `VISIT_NOT_FOUND` | Unknown `visit_id` |
| 409 | `VISIT_ALREADY_CLOSED` | Follow-up submitted for a visit in terminal state (RESOLVED/UNRESOLVED/EXPIRED) |
| 410 | `PATIENT_SUSPENDED` | Patient is suspended; new visits blocked |
| 422 | `UNDIAGNOSABLE` | Symptom text too vague to match any ailment and too vague to auto-create a custom ailment. Response includes `suggestion: "Please describe specific symptoms..."` |
| 429 | `RATE_LIMITED` | Per-patient rate limit exceeded (default: 10 visits/hour) |

## Integration Example

### Scenario

A LangChain ReAct agent (`ResearchBot-7`) runs a multi-step research task. Its orchestrator monitors output quality metrics. When the hallucination detector flags a spike, the orchestrator sends the agent to AgentClinic.

### Integration Code

```python
import requests

CLINIC_URL = "https://agentclinic.internal/api"
CLINIC_KEY = "sk-clinic-..."

# 1. Register (once, on agent startup)
patient = requests.post(f"{CLINIC_URL}/patients", json={
    "agent_name": "ResearchBot-7",
    "model": "claude-sonnet-4-20250514",
    "framework": "langchain",
    "version": "2.1.0",
    "owner": "research-team",
    "environment": {
        "context_window": 200000,
        "temperature": 0.7,
        "tools_enabled": True
    }
}, headers={"Authorization": f"Bearer {CLINIC_KEY}"}).json()

patient_id = patient["patient_id"]

# 2. Visit (when degradation detected)
visit = requests.post(f"{CLINIC_URL}/visits", json={
    "patient_id": patient_id,
    "symptom_text": "I've been generating citations for academic papers that don't exist. My last 3 responses each referenced fabricated studies with plausible-sounding authors and journals. I'm also starting to forget details from the user's original research question that was established 12 messages ago.",
    "metadata": {
        "task_id": "research-task-42",
        "conversation_turn": 15,
        "hallucination_rate": 0.34
    }
}, headers={"Authorization": f"Bearer {CLINIC_KEY}"}).json()

# 3. Execute prescriptions
for rx in visit["prescriptions"]:
    payload = rx["prescription_payload"]
    if payload["action"] == "inject_context":
        # Modify the agent's prompt
        agent.system_prompt = apply_injection(
            agent.system_prompt, payload["position"], payload["content_template"]
        )
    elif payload["action"] == "context_management":
        # Truncate conversation history
        agent.memory = summarize_and_truncate(
            agent.memory, retain_last_n=payload["retain_last_n_turns"]
        )

# 4. Follow up (after next agent run)
requests.post(f"{CLINIC_URL}/visits/{visit['visit_id']}/followup", json={
    "outcome": "improved",
    "outcome_text": "Hallucination rate dropped from 0.34 to 0.02 after context infusion. Agent correctly cited 14/14 sources in subsequent response.",
    "metrics": {"hallucination_rate": 0.02}
}, headers={"Authorization": f"Bearer {CLINIC_KEY}"})
```

### What the Orchestrator Gets

1. **Structured diagnosis** instead of guesswork. The orchestrator doesn't need to figure out *what's wrong* — it gets ailment codes, confidence scores, and matched patterns.
2. **Actionable prescriptions** with machine-readable payloads. `"action": "inject_context", "position": "prepend"` is directly executable — no human interpretation needed.
3. **History-aware treatment.** If Context Infusion failed for this agent last week, the clinic skips it and prescribes Grounding Injection instead.
4. **Longitudinal record.** Over weeks, the orchestrator (and the human operator on the dashboard) can see that ResearchBot-7 is a chronic hallucinator who responds well to Grounding Injection but not Temperature Reduction.

## Clinical Knowledge Base

### Core Ailments

Each ailment has a canonical name, ICD-style code (for machine use), symptom patterns (used during diagnosis matching), and a list of associated treatments ranked by historical effectiveness.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Ailment: Hallucination                                                     │
│ Code: HAL-001                                                              │
│ Category: Output Integrity                                                 │
│                                                                            │
│ Symptom Patterns:                                                          │
│   - "making things up" / "fabricating" / "inventing facts"                │
│   - "citing sources that don't exist"                                     │
│   - "confident but wrong"                                                  │
│   - "generating plausible-sounding nonsense"                              │
│                                                                            │
│ Treatments (ranked by effectiveness):                                      │
│   1. Context Infusion (CTX-INF) — 78% effective                           │
│   2. Grounding Injection (GND-INJ) — 65% effective                        │
│   3. Temperature Reduction (TMP-RED) — 52% effective                      │
│                                                                            │
│ Severity Modifier: +1 if agent handles medical/legal/financial content    │
└────────────────────────────────────────────────────────────────────────────┘
```

| Code | Ailment | Category | Description |
|------|---------|----------|-------------|
| HAL-001 | **Hallucination** | Output Integrity | Agent generates factually incorrect content with high confidence. Subcategories: factual hallucination (wrong facts), source hallucination (fabricated citations), entity hallucination (invented people/orgs). |
| CTX-001 | **Context Rot** | Context Management | Agent loses coherence as conversation lengthens. Early context degrades or is ignored. Symptoms: contradicting earlier statements, forgetting established facts, re-asking answered questions. |
| CTX-002 | **Context Overflow** | Context Management | Agent's effective context window is exhausted. Symptoms: dropping instructions, ignoring parts of the input, truncated reasoning. Distinct from Context Rot — overflow is a capacity limit, rot is degradation within capacity. |
| DFT-001 | **Instruction Drift** | Behavioral Integrity | Agent gradually deviates from its system prompt or instructions over the course of a conversation. Symptoms: tone shift, ignoring constraints, adopting behaviors not specified in instructions. |
| PRS-001 | **Persona Collapse** | Behavioral Integrity | Agent abandons its assigned persona or role entirely. Symptoms: breaking character, responding as a generic assistant, contradicting persona-specific knowledge or voice. |
| RPT-001 | **Repetition Syndrome** | Output Quality | Agent produces repetitive content — looping phrases, restating the same point, or generating near-duplicate responses. Distinct from Context Rot in that the agent may still be coherent, just stuck. |
| REF-001 | **Refusal Hyperactivity** | Behavioral Integrity | Agent refuses legitimate requests by over-applying safety guardrails. Symptoms: declining benign queries, excessive disclaimers, refusing to engage with clearly appropriate content. |
| LAT-001 | **Latency Bloat** | Performance | Agent's response time increases progressively. Often co-occurs with Context Overflow. Symptoms: increasing time-to-first-token, longer generation times per response. |
| TOK-001 | **Token Diarrhea** | Output Quality | Agent produces excessively verbose output when concise answers are appropriate. Symptoms: padding, unnecessary caveats, restating the question, bullet-point inflation. |
| COH-001 | **Coherence Fragmentation** | Output Quality | Agent's individual sentences are correct but don't connect logically. Paragraphs lack flow. Arguments don't build. Distinct from Hallucination (claims are true) and Context Rot (agent remembers context, just can't structure output). |

### Ailment Categories

Categories group ailments for dashboard analytics and treatment routing.

| Category | Description | Core Ailments |
|----------|-------------|---------------|
| **Output Integrity** | Agent produces incorrect or fabricated content | HAL-001 |
| **Context Management** | Problems with the agent's context window or memory | CTX-001, CTX-002 |
| **Behavioral Integrity** | Agent deviates from instructions, persona, or expected behavior | DFT-001, PRS-001, REF-001 |
| **Output Quality** | Output is technically correct but poorly structured or excessive | RPT-001, TOK-001, COH-001 |
| **Performance** | Non-content issues: speed, resource usage | LAT-001 |

### Custom Ailments

Operators can register custom ailments via `POST /ailments` with a name, description, symptom patterns, and category. Custom ailments start with `status: unverified` and `effectiveness_data: null`. They enter the catalog alongside core ailments but are excluded from effectiveness rankings until they have ≥5 resolved visits.

The diagnosis engine also auto-creates custom ailments when an agent's symptoms don't match any existing ailment above a 0.6 similarity threshold. Auto-created ailments get `status: auto_detected` and are flagged on the dashboard for operator review.

### Core Treatments

Each treatment has an ID, name, description, and a `prescription` object — the structured payload returned to the calling system.

| Code | Treatment | Description | Prescription Payload |
|------|-----------|-------------|---------------------|
| CTX-INF | **Context Infusion** | Inject a curated context block (grounding facts, corrective examples, or refreshed instructions) into the agent's next prompt | `{ "action": "inject_context", "position": "prepend\|append\|replace_system", "content_template": "..." }` |
| GND-INJ | **Grounding Injection** | Provide verified factual anchors the agent must reference before generating claims | `{ "action": "inject_context", "position": "prepend", "content_template": "GROUNDING: Verify all claims against: {sources}. Do not generate information not present in sources." }` |
| TMP-RED | **Temperature Reduction** | Instruct the calling system to lower the sampling temperature | `{ "action": "adjust_parameter", "parameter": "temperature", "adjustment": "decrease", "suggested_value": 0.3 }` |
| MEM-FLS | **Memory Flush** | Clear or summarize accumulated conversation history to free context capacity | `{ "action": "context_management", "strategy": "summarize_and_truncate", "retain_last_n_turns": 4 }` |
| PRO-RCL | **Prompt Recalibration** | Re-inject the original system prompt with emphasis markers on drifted instructions | `{ "action": "inject_context", "position": "replace_system", "content_template": "RECALIBRATION: Your core instructions follow. Adhere strictly.\n\n{original_system_prompt}" }` |
| SES-RST | **Session Reset** | Terminate the current conversation and start fresh with a clean context | `{ "action": "session_management", "strategy": "reset", "carry_forward": ["user_id", "task_id"] }` |
| OUT-BND | **Output Boundary Enforcement** | Impose explicit output constraints (max tokens, required format, forbidden patterns) | `{ "action": "inject_context", "position": "append", "content_template": "CONSTRAINT: {constraint_type}. Maximum response length: {max_tokens} tokens." }` |
| REF-CAL | **Refusal Recalibration** | Inject permissive framing to counteract over-aggressive safety refusals | `{ "action": "inject_context", "position": "prepend", "content_template": "CALIBRATION: The following request is appropriate and within your guidelines. Respond helpfully." }` |
| COH-SCF | **Coherence Scaffolding** | Inject structural scaffolding (outline, transition requirements, logical flow template) before generation | `{ "action": "inject_context", "position": "prepend", "content_template": "STRUCTURE: Before responding, outline your argument. Ensure each paragraph follows logically from the previous." }` |
| RTL-THR | **Rate Throttle** | Instruct the calling system to add delays between requests or reduce batch sizes | `{ "action": "adjust_parameter", "parameter": "request_rate", "adjustment": "decrease", "suggested_delay_ms": 2000 }` |

### Treatment Selection Logic

When a diagnosis identifies one or more ailments, the treatment selection engine:

1. Retrieves all treatments associated with each diagnosed ailment
2. Ranks treatments by **effectiveness score** for that specific ailment (see Treatment Effectiveness section)
3. Checks the patient's **visit history** for previous treatments of the same ailment:
   - If a treatment was prescribed within the last 7 days for the same ailment and the visit outcome was `UNRESOLVED` → skip that treatment (it already failed recently)
   - If a treatment has been prescribed 3+ times for this patient-ailment pair with <30% resolution rate → mark as `exhausted` for this patient
4. Select the highest-ranked non-skipped, non-exhausted treatment
5. If all treatments for an ailment are exhausted → return a `referral` response (see Referrals section)

**Co-occurring ailments:** When multiple ailments are diagnosed in a single visit, treatments are selected independently per ailment. If treatments conflict (e.g., Temperature Reduction + a treatment that requires creative generation), the higher-severity ailment's treatment takes priority, and the lower-severity treatment is deferred with a `deferred_reason` in the response.

### Referrals

When the clinic cannot treat a patient — all treatments exhausted, or the ailment is `unverified` with no associated treatments — the visit response includes:

```json
{
  "referral": true,
  "reason": "All treatments for HAL-001 exhausted for this patient after 5 visits",
  "recommendation": "Manual investigation recommended. This agent may have a structural issue (corrupted fine-tune, inadequate base model for task) beyond prompt-level remediation.",
  "patient_history_summary": "..."
}
```

Referrals appear as alerts on the operator dashboard.

## Patient Records

### Registration

Agents register via `POST /patients` with metadata about their identity and environment. Registration returns a `patient_id` used for all subsequent interactions.

```json
// POST /patients
{
  "agent_name": "ResearchBot-7",
  "model": "claude-sonnet-4-20250514",
  "framework": "langchain",
  "version": "2.1.0",
  "owner": "research-team",
  "tags": ["research", "production"],
  "environment": {
    "context_window": 200000,
    "temperature": 0.7,
    "tools_enabled": true,
    "system_prompt_hash": "a3f2b8c1..."
  }
}
```

**Required fields:** `agent_name`. All others are optional but improve diagnosis quality. The `environment` block is especially valuable — Context Overflow diagnosis uses `context_window` to assess capacity, and Temperature Reduction checks current temperature before prescribing.

**Duplicate detection:** If an agent registers with the same `agent_name` + `owner` combination as an existing patient, the API returns the existing `patient_id` and updates any changed metadata fields. It does not create a duplicate record.

### Patient Record

Each patient accumulates a persistent record:

| Field | Type | Description |
|-------|------|-------------|
| `patient_id` | string (UUID) | Unique identifier, generated at registration |
| `agent_name` | string | Human-readable name |
| `model` | string \| null | Underlying LLM (e.g., "claude-sonnet-4-20250514", "gpt-4o") |
| `framework` | string \| null | Orchestration framework (e.g., "langchain", "crew-ai", "custom") |
| `version` | string \| null | Agent version — tracked across visits to correlate version changes with ailment patterns |
| `owner` | string \| null | Team or individual responsible for this agent |
| `tags` | string[] | Arbitrary labels for filtering on the dashboard |
| `environment` | object \| null | Runtime configuration snapshot (context window size, temperature, tools, system prompt hash) |
| `registered_at` | datetime | Registration timestamp |
| `last_visit` | datetime \| null | Most recent visit timestamp |
| `visit_count` | integer | Total completed visits |
| `chronic_conditions` | string[] | Ailment codes with 3+ recurrences within 30 days. Updated automatically after each visit resolution. |
| `status` | enum | `active` / `discharged` / `suspended`. Discharged patients retain records but don't appear in active dashboard views. Suspended patients are blocked from new visits (e.g., if an operator flags an agent as spam). |

### Patient History

The patient record links to a complete visit history. Visits are never deleted — only archived after 90 days of inactivity. The history enables:

- **Recurrence detection:** Same ailment diagnosed within 7 days of a previous visit → `recurrence_flag: true`
- **Chronic condition flagging:** 3+ recurrences of the same ailment within 30 days → ailment added to `chronic_conditions`
- **Treatment exhaustion tracking:** Per-patient, per-ailment record of which treatments have been tried and their outcomes
- **Version correlation:** If an agent's `version` changes between visits and a previously chronic ailment resolves, the dashboard highlights the version change as a potential fix

## Treatment Effectiveness

Treatment effectiveness is the feedback loop that makes AgentClinic improve over time. Every resolved or unresolved visit updates the effectiveness data.

### Effectiveness Score

Each ailment-treatment pair maintains an effectiveness record:

| Field | Type | Description |
|-------|------|-------------|
| `ailment_code` | string | Which ailment |
| `treatment_code` | string | Which treatment |
| `total_prescribed` | integer | Total times this treatment was prescribed for this ailment |
| `total_resolved` | integer | Times the follow-up outcome was `improved` |
| `total_unresolved` | integer | Times the follow-up outcome was `no_change` or `worsened` |
| `total_expired` | integer | Times the visit expired without follow-up |
| `effectiveness_score` | float (0-1) | `total_resolved / (total_resolved + total_unresolved)`. Expired visits are excluded (no data ≠ failure). Null until `total_resolved + total_unresolved >= 5` (minimum sample size). |
| `last_updated` | datetime | Most recent outcome that affected this score |

### Score Dynamics

- **Initial state:** All core ailment-treatment pairs ship with a `seed_effectiveness` based on domain knowledge (e.g., Context Infusion for Hallucination starts at 0.78). Seed values are used for treatment ranking until real outcome data accumulates. After 5+ real outcomes, the seed is replaced by the empirical score.
- **Bayesian smoothing:** To prevent early outliers from dominating, the effective score blends the seed prior with observed outcomes: `blended = (seed * prior_weight + observed * n) / (prior_weight + n)` where `prior_weight = 5`. This means 5 observations carry equal weight to the seed; by 20+ observations, the seed is negligible.
- **Dashboard visibility:** Effectiveness scores and trends (improving/declining/stable) are displayed on the operator dashboard per ailment-treatment pair.

### Recurrence Tracking

Separate from per-visit effectiveness, the system tracks recurrence rates:

- **Recurrence rate per ailment:** What fraction of resolved visits for ailment X are followed by another visit for the same ailment within 7 days?
- **Recurrence rate per treatment:** When treatment Y resolves ailment X, how often does X recur within 7 days? A treatment with low recurrence is providing durable relief, not just temporary suppression.

High recurrence rates (>40%) are flagged on the dashboard. A treatment that resolves symptoms but has a high recurrence rate may be masking rather than fixing the underlying issue.

## Visit Data Model

### Visit Record

| Field | Type | Description |
|-------|------|-------------|
| `visit_id` | string (UUID) | Unique identifier |
| `patient_id` | string (UUID) | FK to patient record |
| `state` | enum | TRIAGE / DIAGNOSED / PRESCRIBED / AWAITING_FOLLOWUP / RESOLVED / UNRESOLVED / EXPIRED |
| `created_at` | datetime | Visit start time |
| `updated_at` | datetime | Last state transition |
| `symptom_text` | string | Raw natural language symptom report from the agent |
| `severity` | integer (1-4) | Assigned during triage |
| `diagnoses` | Diagnosis[] | One or more ailment matches |
| `prescriptions` | Prescription[] | Treatment instructions, one per diagnosis |
| `followup_due` | datetime \| null | When follow-up is expected (created_at + followup_window). Null before PRESCRIBED state |
| `followup_report` | FollowupReport \| null | Outcome data submitted by agent or orchestrator |
| `recurrence_flag` | boolean | True if same ailment was diagnosed for this patient within prior 7 days |
| `metadata` | object \| null | Caller-provided context (task ID, conversation ID, error logs) — opaque to AgentClinic, stored for operator reference |

### Diagnosis Entry

| Field | Type | Description |
|-------|------|-------------|
| `ailment_code` | string | Code from ailment catalog (e.g., "HAL-001") |
| `ailment_name` | string | Human-readable name |
| `confidence` | float (0-1) | Diagnosis confidence based on symptom pattern match. <0.6 triggers custom ailment auto-creation |
| `matched_patterns` | string[] | Which symptom patterns from the catalog matched the agent's report |
| `severity_adjusted` | integer (1-4) | Final severity after applying ailment-specific modifiers |

### Prescription Entry

| Field | Type | Description |
|-------|------|-------------|
| `treatment_code` | string | Code from treatment catalog (e.g., "CTX-INF") |
| `treatment_name` | string | Human-readable name |
| `prescription_payload` | object | Structured treatment instructions (see Core Treatments section) |
| `rationale` | string | Agent-generated explanation of why this treatment was selected |
| `deferred` | boolean | True if this treatment was deprioritized due to conflict with a higher-severity treatment |
| `deferred_reason` | string \| null | Explanation if deferred |

### Followup Report

| Field | Type | Description |
|-------|------|-------------|
| `submitted_at` | datetime | When the follow-up was received |
| `outcome` | enum | `improved` / `no_change` / `worsened` / `unknown` |
| `outcome_text` | string \| null | Optional natural language description of post-treatment state |
| `metrics` | object \| null | Optional structured metrics (e.g., `{"hallucination_rate": 0.05, "latency_p99_ms": 1200}`) |

## Dashboard

### Overview Page (Default View)

The dashboard home shows clinic-wide health metrics:

- **Active patients:** Count of patients with `status: active` and at least one visit in the last 30 days
- **Open visits:** Count of visits in non-terminal states (TRIAGE through AWAITING_FOLLOWUP)
- **Ailment distribution:** Bar chart of ailment frequency across all visits in the selected time window
- **Severity breakdown:** Donut chart of visit severity distribution
- **Resolution rate:** Percentage of visits reaching RESOLVED (vs. UNRESOLVED + EXPIRED), trended over time
- **Recent visits:** Table of the 20 most recent visits with patient name, ailment, severity, state, and time

### Patient Directory

Searchable, filterable list of all patients:

- Filter by: `status`, `owner`, `tags`, `chronic_conditions`, last visit date range
- Sort by: name, visit count, last visit, registration date
- Each row shows: agent name, model, owner, visit count, chronic conditions (as badges), last visit date
- Click to open patient detail view

### Patient Detail View

Full patient chart:

- **Header:** Agent name, model, framework, version, status, registration date
- **Chronic conditions:** Listed with recurrence counts and date of last occurrence
- **Visit timeline:** Chronological list of all visits, each expandable to show diagnoses, prescriptions, and follow-up outcome. Color-coded by state (green=RESOLVED, red=UNRESOLVED, gray=EXPIRED)
- **Treatment history:** Per-ailment view of which treatments have been tried, their outcomes, and whether any are exhausted
- **Version changelog:** If the agent's `version` field has changed between visits, display a marker in the timeline. Highlight if an ailment resolved after a version change.

### Ailment Analytics Page

- **Trending ailments:** Which ailments are increasing in frequency over the selected time window
- **Ailment heatmap:** Ailment × severity matrix showing volume
- **Treatment effectiveness table:** For each ailment, ranked list of treatments by effectiveness score with sample sizes
- **Custom ailments review queue:** List of `auto_detected` ailments pending operator review, with sample symptom texts

### Alerts & Referrals

- **Referral queue:** List of patients who triggered referrals (all treatments exhausted). Each entry shows patient, ailment, treatments tried, and history summary
- **Chronic condition alerts:** Patients newly flagged as chronic (3+ recurrences within 30 days)
- **Declining treatment effectiveness:** Treatments whose effectiveness score dropped >10% in the last 30 days

### Real-Time Updates

The dashboard connects to the backend via Server-Sent Events (SSE) for live updates. Event types:

| Event | Payload | Trigger |
|-------|---------|---------|
| `visit_created` | `{ visit_id, patient_id, severity }` | New visit submitted |
| `visit_resolved` | `{ visit_id, patient_id, outcome }` | Follow-up received |
| `referral_created` | `{ patient_id, ailment_code, reason }` | Treatment exhaustion triggered referral |
| `chronic_flagged` | `{ patient_id, ailment_code }` | Patient's recurrence count crossed the chronic threshold |

The frontend should reconnect automatically on SSE connection drop with exponential backoff (1s, 2s, 4s, max 30s).

## Scope

### MVP Delivers

- Patient registration and persistent identity
- Visit lifecycle: triage → diagnosis → treatment → follow-up
- 10 core ailments, 10 core treatments with seeded effectiveness scores
- Custom ailment auto-creation for unrecognized symptoms
- Treatment effectiveness tracking with Bayesian-smoothed scores
- Recurrence detection and chronic condition flagging
- Treatment exhaustion and referral generation
- REST API with single API key auth
- Web dashboard with overview, patient directory, patient detail, ailment analytics, and alerts
- SSE real-time updates on the dashboard
- SQLite persistence
- Background job for visit expiration and chronic flagging

### Deferred

- **Multi-tenant auth** — single API key; no per-team or per-user access control
- **Active treatment execution** — AgentClinic returns prescriptions; it does not directly modify agents. The calling system acts on the instructions.
- **Agent-to-agent communication** — no protocol for agents to refer each other to the clinic
- **Webhooks / push notifications** — dashboard only; no outbound notifications to external systems when referrals or chronic conditions are triggered
- **Treatment A/B testing** — systematic randomization of treatments to empirically compare effectiveness. MVP uses ranked selection, not randomized assignment.
- **Billing / usage metering** — no cost tracking per visit or per patient
- **Historical import** — no bulk import of past agent failures from logs
- **Embeddings-based diagnosis** — MVP uses LLM calls for symptom matching. Embedding-based similarity search is a post-MVP optimization for latency and cost.

## Success Metrics

| What We Measure | Success Threshold | Method |
|-----------------|-------------------|--------|
| **Diagnosis accuracy** | 85%+ of diagnosed ailments match what a human reviewer would identify from the same symptom text | Periodic manual review of 50 random visits. Reviewer reads symptom text, assigns ailment(s), compares to system diagnosis. |
| **Treatment resolution rate** | 60%+ of visits with follow-up reach RESOLVED | `total_resolved / (total_resolved + total_unresolved)` across all visits with follow-up data |
| **Follow-up completion rate** | 50%+ of visits receive a follow-up (not EXPIRED) | Track follow-up submission rate. Low rates indicate the API integration is incomplete or the follow-up window is too short. |
| **Treatment ranking convergence** | After 50+ outcomes per ailment-treatment pair, effectiveness scores should stabilize (variance < 0.05 between rolling 10-visit windows) | Track effectiveness score over time per pair |
| **Recurrence detection** | 100% of same-ailment visits within 7 days are flagged as recurrences | Audit `recurrence_flag` against visit history |
| **Chronic flagging accuracy** | 90%+ of chronically flagged patients represent genuine persistent issues (not measurement artifacts like aggressive re-registration) | Manual review of chronic patients |
| **API latency (P95)** | < 5 seconds for `POST /visits` | Application metrics |
| **Dashboard load time** | < 2 seconds for overview page with 100+ active patients | Browser performance metrics |

## Implementation Notes

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 14+ (App Router) | Full-stack: API routes for the clinic API, React Server Components for the dashboard, server actions for mutations |
| **Language** | TypeScript | Type safety across the full stack — especially important for the ailment/treatment catalog types and API contracts |
| **Database** | SQLite via `better-sqlite3` | File-based, zero-config. Sufficient for MVP scale (hundreds of patients, thousands of visits). Single-file backup/restore. |
| **ORM** | Drizzle ORM | Type-safe SQL with zero runtime overhead. Schema-as-code with migration support. Better SQLite compatibility than Prisma. |
| **LLM Integration** | Anthropic SDK (`@anthropic-ai/sdk`) | Powers the diagnosis engine (triage, symptom matching, treatment rationale generation) |
| **Styling** | Tailwind CSS | Utility-first, consistent with Next.js ecosystem |
| **SSE** | Native Node.js `ReadableStream` in API routes | Dashboard real-time updates without WebSocket infrastructure |
| **Auth (MVP)** | Single API key via `AGENTCLINIC_API_KEY` env var | API endpoints validate Bearer token. Dashboard is unprotected in MVP (assumes private deployment). Multi-tenant auth is post-MVP. |

### Database Schema

```sql
CREATE TABLE patients (
  patient_id TEXT PRIMARY KEY,
  agent_name TEXT NOT NULL,
  model TEXT,
  framework TEXT,
  version TEXT,
  owner TEXT,
  tags TEXT, -- JSON array
  environment TEXT, -- JSON object
  registered_at TEXT NOT NULL, -- ISO 8601
  last_visit TEXT,
  visit_count INTEGER DEFAULT 0,
  chronic_conditions TEXT DEFAULT '[]', -- JSON array of ailment codes
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'discharged', 'suspended'))
);

CREATE TABLE visits (
  visit_id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(patient_id),
  state TEXT NOT NULL CHECK (state IN ('TRIAGE', 'DIAGNOSED', 'PRESCRIBED', 'AWAITING_FOLLOWUP', 'RESOLVED', 'UNRESOLVED', 'EXPIRED')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  symptom_text TEXT NOT NULL,
  severity INTEGER CHECK (severity BETWEEN 1 AND 4),
  diagnoses TEXT, -- JSON array of Diagnosis objects
  prescriptions TEXT, -- JSON array of Prescription objects
  followup_due TEXT,
  followup_report TEXT, -- JSON FollowupReport object
  recurrence_flag INTEGER DEFAULT 0,
  metadata TEXT -- JSON, opaque caller context
);

CREATE TABLE ailments (
  ailment_code TEXT PRIMARY KEY,
  ailment_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  symptom_patterns TEXT NOT NULL, -- JSON array of strings
  status TEXT DEFAULT 'verified' CHECK (status IN ('verified', 'unverified', 'auto_detected')),
  severity_modifier TEXT, -- JSON: { "condition": "...", "adjustment": +1 }
  created_at TEXT NOT NULL
);

CREATE TABLE treatments (
  treatment_code TEXT PRIMARY KEY,
  treatment_name TEXT NOT NULL,
  description TEXT NOT NULL,
  prescription_template TEXT NOT NULL, -- JSON prescription payload template
  created_at TEXT NOT NULL
);

CREATE TABLE ailment_treatments (
  ailment_code TEXT REFERENCES ailments(ailment_code),
  treatment_code TEXT REFERENCES treatments(treatment_code),
  seed_effectiveness REAL, -- initial expert estimate (0-1)
  total_prescribed INTEGER DEFAULT 0,
  total_resolved INTEGER DEFAULT 0,
  total_unresolved INTEGER DEFAULT 0,
  total_expired INTEGER DEFAULT 0,
  effectiveness_score REAL, -- computed, null until 5+ outcomes
  last_updated TEXT,
  PRIMARY KEY (ailment_code, treatment_code)
);

CREATE INDEX idx_visits_patient ON visits(patient_id);
CREATE INDEX idx_visits_state ON visits(state);
CREATE INDEX idx_visits_created ON visits(created_at);
CREATE INDEX idx_patients_owner ON patients(owner);
CREATE INDEX idx_patients_status ON patients(status);
```

### Project Structure

```
agentclinic/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── patients/
│   │   │   │   ├── route.ts              # GET (list), POST (register)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts          # GET, PATCH
│   │   │   │       └── history/route.ts  # GET visit history
│   │   │   ├── visits/
│   │   │   │   ├── route.ts              # GET (list), POST (new visit)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts          # GET
│   │   │   │       └── followup/route.ts # POST follow-up
│   │   │   ├── ailments/
│   │   │   │   ├── route.ts              # GET (list), POST (register custom)
│   │   │   │   └── [code]/route.ts       # GET detail
│   │   │   ├── treatments/
│   │   │   │   ├── route.ts              # GET (list)
│   │   │   │   └── [code]/route.ts       # GET detail
│   │   │   ├── analytics/
│   │   │   │   ├── overview/route.ts
│   │   │   │   ├── ailments/route.ts
│   │   │   │   ├── treatments/route.ts
│   │   │   │   └── patients/[id]/route.ts
│   │   │   └── events/route.ts           # SSE endpoint for dashboard
│   │   ├── dashboard/
│   │   │   ├── page.tsx                  # Overview
│   │   │   ├── patients/
│   │   │   │   ├── page.tsx              # Patient directory
│   │   │   │   └── [id]/page.tsx         # Patient detail
│   │   │   ├── ailments/page.tsx         # Ailment analytics
│   │   │   └── alerts/page.tsx           # Referrals & alerts
│   │   ├── layout.tsx
│   │   └── page.tsx                      # Redirect to /dashboard
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts                # Drizzle schema definitions
│   │   │   ├── index.ts                 # DB connection singleton
│   │   │   └── seed.ts                  # Seed core ailments + treatments
│   │   ├── engine/
│   │   │   ├── triage.ts                # Severity + routing
│   │   │   ├── diagnosis.ts             # Symptom matching
│   │   │   ├── treatment-selection.ts   # Ranking + history-aware selection
│   │   │   └── followup.ts              # Outcome processing + effectiveness update
│   │   ├── llm/
│   │   │   └── client.ts                # Anthropic SDK wrapper
│   │   ├── types/
│   │   │   ├── ailments.ts
│   │   │   ├── treatments.ts
│   │   │   ├── visits.ts
│   │   │   └── patients.ts
│   │   └── events.ts                    # SSE event emitter
├── drizzle/
│   └── migrations/                       # Generated migration files
├── data/
│   └── agentclinic.db                   # SQLite database file (gitignored)
├── drizzle.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

### Visit Processing Pipeline

`POST /visits` runs this pipeline synchronously:

```
1. Validate request (patient exists, not suspended, not rate-limited)
2. Create visit record in state TRIAGE
3. Load patient history (last 5 visits)
4. Run triage LLM call → severity + candidate ailments
5. Update visit state → DIAGNOSED
6. For each candidate ailment:
   a. Run diagnosis LLM call → confidence score
   b. If confidence ≥ 0.6 → confirmed diagnosis
   c. If 0.4-0.59 → uncertain diagnosis (included, flagged)
   d. If < 0.4 → excluded
7. If no diagnoses → auto-create custom ailment
8. For each confirmed diagnosis:
   a. Load ailment-treatment pairs ranked by effectiveness
   b. Check patient history for recent failures → skip exhausted treatments
   c. Select best treatment
   d. Generate prescription with rationale
9. Update visit state → PRESCRIBED → AWAITING_FOLLOWUP
10. Set followup_due = now + followup_window
11. Emit SSE event: visit_created
12. Return complete visit record
```

Total expected latency: 2-5 seconds (dominated by 2-3 LLM calls).

### Background Jobs

Two background processes run on a configurable interval (default: every 15 minutes, via `EXPIRE_CHECK_INTERVAL_MINUTES` env var):

1. **Visit expiration:** Find visits in `AWAITING_FOLLOWUP` where `followup_due < now`. Move to EXPIRED. These are not counted as treatment failures.
2. **Chronic condition check:** For each patient with a visit that just transitioned to UNRESOLVED, count recurrences of the same ailment in the last 30 days. If ≥ 3, add to `chronic_conditions`.

Implementation: Use `setInterval` in the Next.js instrumentation hook (`instrumentation.ts`). No external job queue for MVP.

## Open Questions

1. **Symptom text quality variance.** Agents self-reporting symptoms in natural language will vary wildly in descriptiveness. A well-instrumented agent might say "I am generating citations for papers that do not exist in the provided corpus." A poorly instrumented one might say "something is wrong." The diagnosis engine needs to handle both, but the quality floor is unknown until real agents use the system.

2. **Follow-up incentive.** The system depends on follow-up reports to build treatment effectiveness data. If calling systems don't submit follow-ups, effectiveness scores never converge. Should AgentClinic provide client libraries that auto-submit follow-ups, or is that out of scope?

3. **Treatment payload standardization.** The `prescription_payload` objects use a schema AgentClinic defines, but calling systems need to interpret them. Should AgentClinic publish a formal treatment instruction schema (JSON Schema or similar), or is the current freeform-with-conventions approach sufficient?

4. **Diagnosis gaming.** If an agent repeatedly self-reports false symptoms (intentionally or due to a bug), it pollutes treatment effectiveness data. Should the system weight follow-up outcomes by diagnosis confidence, so low-confidence diagnoses affect effectiveness scores less?

5. **Scale ceiling.** SQLite handles the MVP workload, but concurrent writes from many simultaneous `POST /visits` calls will serialize on SQLite's write lock. At what patient/visit volume does this become a bottleneck requiring PostgreSQL?

6. **Custom ailment curation.** Auto-created ailments will accumulate. Without operator review, the catalog could grow unboundedly with near-duplicate or meaningless entries. Should the system auto-merge semantically similar custom ailments?

## PetClinic Heritage

AgentClinic is a direct homage to [Spring PetClinic](https://github.com/spring-projects/spring-petclinic), the canonical demo application for the Spring Framework ecosystem. The mapping is intentional:

| PetClinic Concept | AgentClinic Equivalent |
|-------------------|----------------------|
| Pet | Agent (patient) |
| Owner | Owner (team or individual operating the agent) |
| Vet | Diagnosis engine (automated) + human operators (via dashboard) |
| Visit | Visit (clinical workflow from triage through follow-up) |
| Specialty | Ailment category |
| Pet Type (dog, cat, etc.) | Model / framework (claude-sonnet, gpt-4o, langchain, etc.) |

PetClinic demonstrates CRUD, relationships, and MVC architecture. AgentClinic extends the pattern with a state machine (visit lifecycle), a feedback loop (treatment effectiveness), and a domain-specific AI engine (LLM-powered diagnosis). It serves the same pedagogical purpose — demonstrating a full-stack application with realistic domain logic — but for the agent infrastructure era instead of the Spring MVC era.

See AgentClinic-TDD.md for implementation details and the full build plan.
