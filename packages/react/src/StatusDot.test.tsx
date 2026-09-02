import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusDot } from "./StatusDot";

describe("StatusDot", () => {
  it("renders its children as the accessible label", () => {
    render(<StatusDot tone="active">운영중</StatusDot>);
    expect(screen.getByText("운영중")).toBeInTheDocument();
  });

  it("merges conflicting Tailwind classes via cn so the caller wins", () => {
    const { container } = render(
      <StatusDot tone="active" className="text-lg">
        운영중
      </StatusDot>,
    );
    const dot = container.firstElementChild as HTMLElement;
    expect(dot.className).toContain("text-lg");
    expect(dot.className).not.toMatch(/text-\[12px\]/);
  });
});
