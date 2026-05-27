import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Header } from "@/app/components/header";

describe("Header", () => {
  afterEach(cleanup);

  it("renders the header with Dashboard text", () => {
    render(<Header />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("displays the Clinic Online status badge", () => {
    render(<Header />);
    expect(screen.getByText("Clinic Online")).toBeInTheDocument();
  });
});
