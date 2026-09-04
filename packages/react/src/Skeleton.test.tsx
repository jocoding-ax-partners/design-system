import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkeletonRow } from "./Skeleton";

describe("SkeletonRow", () => {
  it("carries the caller class on its container", () => {
    const { container } = render(<SkeletonRow className="custom-row" />);
    expect(container.firstElementChild).toHaveClass("custom-row", "flex", "items-center");
  });

  it("renders one skeleton placeholder per width", () => {
    const { container } = render(<SkeletonRow widths={[10, 20, 30]} />);
    expect(container.firstElementChild?.children.length).toBe(3);
  });
});
