export function header(): string {
  return `
    <header class="container">
      <nav>
        <ul>
          <li><strong>AgentClinic</strong></li>
        </ul>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/agents">Agents</a></li>
          <li><a href="/ailments">Ailments</a></li>
        </ul>
      </nav>
    </header>
  `
}
