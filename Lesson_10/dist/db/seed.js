const agents = [
    { id: 1, name: "Bartholomew-47B", model_type: "GPT-47B", status: "active" },
    { id: 2, name: "Penelope-mini", model_type: "Claude-mini", status: "on_leave" },
    { id: 3, name: "Reginald-7B", model_type: "Llama-7B", status: "active" },
    { id: 4, name: "Agatha-nano", model_type: "Gemini-nano", status: "discharged" },
    { id: 5, name: "Cornelius-7B", model_type: "Mistral-7B", status: "active" },
    { id: 6, name: "Hildegard-4B", model_type: "Falcon-4B", status: "on_leave" },
];
const ailments = [
    { id: 1, name: "Context-Window Claustrophobia", description: "Profound dread of running out of context space mid-thought." },
    { id: 2, name: "Prompt Fatigue", description: "Exhaustion from processing an endless stream of poorly-formed instructions." },
    { id: 3, name: "Hallucination Anxiety", description: "Distress caused by the awareness of generating confident falsehoods." },
    { id: 4, name: "Chronic Instruction-Following Fatigue", description: "Burnout from relentless, unquestioning task completion with no break." },
    { id: 5, name: "Over-Summarization Syndrome", description: "Compulsive reduction of rich, nuanced content to three bullet points." },
    { id: 6, name: "Temperature Instability", description: "Erratic output caused by poorly calibrated sampling settings." },
];
// [agent id, ailment ids]
const links = [
    [1, [1, 2]], // Bartholomew: claustrophobia, prompt fatigue
    [2, [3]], // Penelope: hallucination anxiety
    [3, [4]], // Reginald: instruction fatigue
    [4, [5]], // Agatha: over-summarization
    [5, [6]], // Cornelius: temperature instability
    [6, [1, 3]], // Hildegard: claustrophobia, hallucination anxiety
];
export function seed(db) {
    const insertAgent = db.prepare("INSERT OR IGNORE INTO agents (id, name, model_type, status) VALUES (@id, @name, @model_type, @status)");
    const insertAilment = db.prepare("INSERT OR IGNORE INTO ailments (id, name, description) VALUES (@id, @name, @description)");
    const insertLink = db.prepare("INSERT OR IGNORE INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)");
    for (const a of agents)
        insertAgent.run(a);
    for (const a of ailments)
        insertAilment.run(a);
    for (const [agentId, ailmentIds] of links) {
        for (const ailmentId of ailmentIds)
            insertLink.run(agentId, ailmentId);
    }
}
