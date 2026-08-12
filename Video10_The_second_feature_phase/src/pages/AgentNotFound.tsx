// Deliberately NOT wrapped in <Layout>: no header/nav/footer, no PicoCSS.
// Phase 2's requirements.md calls for "plain text/minimal markup only" here —
// the styled error page is Phase 7's job.
export function AgentNotFound() {
  return (
    <p>
      Agent not found. <a href="/agents">Back to Agents</a>
    </p>
  );
}
