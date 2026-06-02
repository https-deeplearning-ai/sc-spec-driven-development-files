import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Sidebar } from "@/app/components/sidebar";
import { Header } from "@/app/components/header";

describe("Dashboard layout", () => {
  afterEach(cleanup);

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

  it("renders header, sidebar, and content area together", () => {
    render(
      <DashboardShell>
        <p>Test content</p>
      </DashboardShell>
    );

    expect(screen.getByText("AgentClinic")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders the main element for content", () => {
    render(
      <DashboardShell>
        <p>Inner</p>
      </DashboardShell>
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
