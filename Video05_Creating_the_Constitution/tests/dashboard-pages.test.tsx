import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import DashboardHome from "@/app/dashboard/page";
import PatientsPage from "@/app/dashboard/patients/page";
import AilmentsPage from "@/app/dashboard/ailments/page";
import VisitsPage from "@/app/dashboard/visits/page";
import AnalyticsPage from "@/app/dashboard/analytics/page";

describe("Dashboard home page", () => {
  afterEach(cleanup);

  it("renders the Clinic Overview heading", () => {
    render(<DashboardHome />);
    expect(screen.getByText("Clinic Overview")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<DashboardHome />);
    expect(screen.getByText("Registered Patients")).toBeInTheDocument();
    expect(screen.getByText("Active Visits")).toBeInTheDocument();
    expect(screen.getByText("Known Ailments")).toBeInTheDocument();
    expect(screen.getByText("Treatments Given")).toBeInTheDocument();
  });

  it("renders Recent Visits and Ailment Trends sections", () => {
    render(<DashboardHome />);
    expect(screen.getByText("Recent Visits")).toBeInTheDocument();
    expect(screen.getByText("Ailment Trends")).toBeInTheDocument();
  });
});

describe("Placeholder pages render without errors", () => {
  afterEach(cleanup);

  it("renders Patients page", () => {
    render(<PatientsPage />);
    expect(screen.getByText("Patients")).toBeInTheDocument();
  });

  it("renders Ailments page", () => {
    render(<AilmentsPage />);
    expect(screen.getByText("Ailment Catalog")).toBeInTheDocument();
  });

  it("renders Visits page", () => {
    render(<VisitsPage />);
    expect(screen.getByText("Visits")).toBeInTheDocument();
  });

  it("renders Analytics page", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });
});
