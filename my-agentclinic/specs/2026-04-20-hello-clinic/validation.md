# Validation: Hello Clinic

## Automated Checks

- `npm run build` compiles the TypeScript project successfully.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm test` runs the basic route tests.
- The home page route test verifies a successful HTTP response.
- The home page route test verifies minimal AgentClinic introductory copy appears in the rendered HTML.

## Manual Checks

- Start the app with the documented development command.
- Open the local home page in a modern browser.
- Confirm the home page introduces AgentClinic as a fictional clinic for AI agents.
- Confirm the clinical metaphor is visible in the copy and remains clearly satirical.
- Confirm the shared layout renders a consistent header, main content area, and footer.
- Confirm the static CSS loads and visibly styles the page.
- Confirm no later roadmap features or product-depth sections are partially implemented.

## Tone Check

- Copy plays the premise straight: AI agents are patients and humans are the source of stress.
- The page does not imply AgentClinic is a real medical product.
- Humor lives in the content, while the code remains clear and maintainable.

## Definition of Done

- Phase 1 scope from `specs/roadmap.md` is implemented.
- Build, typecheck, and tests pass locally.
- The app can be run locally and viewed in a browser.
- The minimal AgentClinic home page is present at `/`.
- The implementation follows the stack guidance in `specs/tech-stack.md`.
- The result is small, understandable, and ready for the next feature phase.
