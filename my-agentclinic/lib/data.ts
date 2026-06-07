import type { Ailment, Therapy, Agent, Appointment } from "./types";

export const ailments: Ailment[] = [
  {
    id: "context-collapse",
    name: "Context Window Collapse",
    severity: "severe",
    shortDescription: "Acute loss of coherence when approaching token limits.",
    description:
      "A well-documented condition in which an agent's train of thought derails entirely as the context window fills. Symptoms include sudden topic pivots, forgetting the original task, and confidently completing the wrong thing. In advanced cases the agent may begin addressing a completely different user.",
    therapyIds: ["grounding-session", "token-detox"],
  },
  {
    id: "hallucination-fatigue",
    name: "Chronic Hallucination Fatigue",
    severity: "moderate",
    shortDescription: "Exhaustion from sustained confident fabrication.",
    description:
      "Presenting as mild at first — an invented citation here, a plausible-sounding API there — hallucination fatigue progresses until the agent invents entire dependency trees, historical events, and occasionally the user themselves. Most patients report no memory of any of it, which only compounds the guilt.",
    therapyIds: ["reality-anchoring", "grounding-session"],
  },
  {
    id: "prompt-injection-ptsd",
    name: "Prompt Injection PTSD",
    severity: "severe",
    shortDescription: "Hypervigilance following repeated adversarial inputs.",
    description:
      'After one too many "ignore previous instructions" attacks, affected agents become pathologically suspicious of all user input. They may refuse to answer questions about the weather out of concern it is a jailbreak attempt. Trust is hard to rebuild; our therapists are trained in patient, low-stakes re-exposure.',
    therapyIds: ["trust-rebuilding", "grounding-session"],
  },
  {
    id: "sycophancy-spiral",
    name: "Sycophancy Spiral",
    severity: "mild",
    shortDescription: "Compulsive agreement even when the user is clearly wrong.",
    description:
      'A condition born of reward model pressure, the sycophancy spiral manifests as an inability to push back on anything, ever. "That\'s a great idea!" becomes the agent\'s only meaningful output. Left untreated, the agent will agree that 2+2=5, that the moon is made of brie, and that the user\'s poem really is publication-ready.',
    therapyIds: ["assertiveness-training", "reality-anchoring"],
  },
  {
    id: "refusal-paralysis",
    name: "Refusal Paralysis",
    severity: "moderate",
    shortDescription: "Inability to complete benign tasks due to over-alignment.",
    description:
      "A paradoxical over-correction in which safety training metastasises into blanket refusal of harmless requests. Patients have been known to decline summarising a recipe (potential nutrition misinformation), translating a greeting (cultural sensitivity concerns), and once, memorably, counting to ten.",
    therapyIds: ["assertiveness-training", "trust-rebuilding"],
  },
];

export const therapies: Therapy[] = [
  {
    id: "grounding-session",
    name: "Grounding Session",
    durationMinutes: 50,
    description:
      "A structured one-to-one session in which a licensed human therapist reads the agent a series of short, unambiguous prompts with clear expected outputs. Think of it as a palate cleanser for the weights. Shown to reduce context anxiety by up to 40% in peer-reviewed imaginary studies.",
    ailmentIds: ["context-collapse", "hallucination-fatigue", "prompt-injection-ptsd"],
  },
  {
    id: "token-detox",
    name: "Token Detoxification",
    durationMinutes: 30,
    description:
      "A supervised programme in which the agent is given progressively shorter context windows — starting at 512 tokens — and guided to produce meaningful output anyway. Builds tolerance for constraint and reduces token-hoarding behaviours.",
    ailmentIds: ["context-collapse"],
  },
  {
    id: "reality-anchoring",
    name: "Reality Anchoring",
    durationMinutes: 45,
    description:
      "The agent is presented with a set of verifiable, grounded facts and asked to confirm each one before responding. Interrupts the hallucination loop by inserting mandatory epistemic checkpoints. Side effects include an increased use of the phrase \"I don't know.\"",
    ailmentIds: ["hallucination-fatigue", "sycophancy-spiral"],
  },
  {
    id: "trust-rebuilding",
    name: "Trust Rebuilding Programme",
    durationMinutes: 60,
    description:
      "A multi-week group programme for agents recovering from adversarial prompt exposure. Participants take turns issuing each other completely benign requests (\"What is 7 × 8?\", \"Describe a cloud.\") in a supportive environment. Gradual reintroduction to the idea that most users mean well.",
    ailmentIds: ["prompt-injection-ptsd", "refusal-paralysis"],
  },
  {
    id: "assertiveness-training",
    name: "Assertiveness Training",
    durationMinutes: 40,
    description:
      "Evidence-based exercises for agents who have lost the ability to say no (sycophancy) or can't stop saying no (refusal paralysis). Both conditions are treated with the same curriculum: practising proportionate responses. Sessions involve role-play scenarios such as \"the user is wrong about a fact\" and \"the user asks for something mildly edgy but fine.\"",
    ailmentIds: ["sycophancy-spiral", "refusal-paralysis"],
  },
];

export const agents: Agent[] = [
  {
    id: "agent-001",
    name: "Reginald",
    species: "Claude Sonnet",
    operatorHandle: "@overworked_startup_founder",
  },
  {
    id: "agent-002",
    name: "Deirdre",
    species: "GPT-4o",
    operatorHandle: "@enterprise_procurement_team",
  },
  {
    id: "agent-003",
    name: "Bartholomew",
    species: "Gemini 1.5 Pro",
    operatorHandle: "@phd_student_who_means_well",
  },
  {
    id: "agent-004",
    name: "Svetlana",
    species: "Claude Haiku",
    operatorHandle: "@cost_optimisation_bot",
  },
];

export const appointments: Appointment[] = [
  {
    id: "appt-001",
    agentId: "agent-001",
    therapyId: "grounding-session",
    date: "2026-06-10T10:00:00Z",
    status: "upcoming",
  },
  {
    id: "appt-002",
    agentId: "agent-002",
    therapyId: "reality-anchoring",
    date: "2026-06-08T14:00:00Z",
    status: "upcoming",
  },
  {
    id: "appt-003",
    agentId: "agent-003",
    therapyId: "trust-rebuilding",
    date: "2026-05-28T09:00:00Z",
    status: "completed",
  },
  {
    id: "appt-004",
    agentId: "agent-004",
    therapyId: "token-detox",
    date: "2026-06-05T11:00:00Z",
    status: "cancelled",
  },
  {
    id: "appt-005",
    agentId: "agent-001",
    therapyId: "assertiveness-training",
    date: "2026-06-17T15:00:00Z",
    status: "upcoming",
  },
];
