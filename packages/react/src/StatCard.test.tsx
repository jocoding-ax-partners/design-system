import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatCard } from "./StatCard.js";

describe("StatCard", () => {
  it("shows its label and value", () => {
    render(<StatCard label="응시자" value={128} />);
    expect(screen.getByText("응시자")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
  });
});
