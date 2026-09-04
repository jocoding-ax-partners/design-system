import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders the given code as text", () => {
    const { container } = render(<CodeBlock code="const answer = 42;" language="ts" />);
    expect(container.textContent).toBe("const answer = 42;");
  });

  it("merges the caller's className onto the pre element", () => {
    const { container } = render(<CodeBlock code="x" language="ts" className="custom-code" />);
    expect(container.querySelector("pre")).toHaveClass("custom-code");
  });
});
