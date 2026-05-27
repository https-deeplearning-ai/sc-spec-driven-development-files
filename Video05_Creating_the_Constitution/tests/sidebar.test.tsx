import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Sidebar } from "@/app/components/sidebar";

describe("Sidebar", () => {
  afterEach(cleanup);

  const navLabels = ["Overview", "Patients", "Ailments", "Visits", "Analytics"];

  it("renders the AgentClinic brand", () => {
    render(<Sidebar />);
    expect(screen.getByText("AgentClinic")).toBeInTheDocument();
  });

  it.each(navLabels)("renders the %s nav link", (label) => {
    render(<Sidebar />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("links to the correct routes", () => {
    render(<Sidebar />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "/dashboard",
      "/dashboard/patients",
      "/dashboard/ailments",
      "/dashboard/visits",
      "/dashboard/analytics",
    ]);
  });
});
