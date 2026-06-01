import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Home page (Phase 1 smoke test)", () => {
  it("calls redirect to /dashboard", async () => {
    const { redirect } = await import("next/navigation");
    render(<Home />);
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });
});
