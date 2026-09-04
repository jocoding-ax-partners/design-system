import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HoverReadout } from "./HoverReadout.js";

describe("HoverReadout", () => {
  it("renders nothing when spot is null", () => {
    const { container } = render(<HoverReadout spot={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the spot's title and value when present", () => {
    render(<HoverReadout spot={{ x: 10, y: 20, title: "9월 3일", value: "12건" }} />);
    expect(screen.getByText("9월 3일")).toBeInTheDocument();
    expect(screen.getByText("12건")).toBeInTheDocument();
  });
});
