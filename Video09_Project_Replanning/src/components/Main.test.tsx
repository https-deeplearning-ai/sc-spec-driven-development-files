import { describe, expect, it } from "vitest";
import { Main } from "./Main";

describe("Main", () => {
  it("wraps its children in a single <main> element", async () => {
    const html = String(
      await (
        <Main>
          <p>content</p>
        </Main>
      ),
    );

    expect(html).toBe("<main><p>content</p></main>");
  });
});
