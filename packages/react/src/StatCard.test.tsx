import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatCard } from "./StatCard.js";

describe("StatCard", () => {
  it("shows its label and value", () => {
    render(<StatCard label="응시자" value={128} />);
    expect(screen.getByText("응시자")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
  });

  it("reads its label at --fg-muted, not the non-text --fg-subtle", () => {
    render(<StatCard label="응시자" value={128} />);
    expect(screen.getByText("응시자")).toHaveClass("text-muted");
    expect(screen.getByText("응시자")).not.toHaveClass("text-subtle");
  });

  it("colors the value per metric with tone, defaulting to the body color", () => {
    const { rerender } = render(<StatCard label="실패" value={3} tone="danger" />);
    expect(screen.getByText("3")).toHaveClass("text-danger-strong");
    for (const [tone, cls] of [
      ["success", "text-success-strong"],
      ["warning", "text-warning-strong"],
      ["accent", "text-accent"],
    ] as const) {
      rerender(<StatCard label="x" value={7} tone={tone} />);
      expect(screen.getByText("7")).toHaveClass(cls);
    }
    rerender(<StatCard label="x" value={9} />);
    expect(screen.getByText("9").className).not.toMatch(/text-(danger|success|warning|accent)/);
  });
});
