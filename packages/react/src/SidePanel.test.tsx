import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SidePanel } from "./SidePanel";

describe("SidePanel", () => {
  it("renders its children when open", () => {
    render(
      <SidePanel open onOpenChange={() => {}} title="상세">
        <p>내용</p>
      </SidePanel>,
    );
    expect(screen.getByText("내용")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const onOpenChange = vi.fn();
    render(
      <SidePanel open onOpenChange={onOpenChange} title="상세">
        <p>내용</p>
      </SidePanel>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
