import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { KpiSearchButton, KpiStatBar } from "./KpiStatBar.js";

describe("KpiStatBar", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      return window.setTimeout(() => callback(0), 0);
    });
  });

  it("renders every metric and the optional action", () => {
    const { container } = render(
      <KpiStatBar
        items={[
          { label: "운영중", value: 12 },
          { label: "대기", value: 3, description: "승인 전" },
        ]}
        actions={<button type="button">필터</button>}
      />,
    );

    expect(screen.getByText("운영중")).toBeInTheDocument();
    expect(screen.getByText("12")).toHaveClass("text-[24px]");
    expect(screen.getByText("승인 전")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "필터" })).toBeInTheDocument();
    const root = container.firstElementChild;
    expect(root).toHaveClass("w-full", "min-w-0", "border-interactive", "flex-col", "sm:flex-row");
    expect(root?.firstElementChild).toHaveClass("flex-col", "sm:flex-row");
    expect(root).not.toHaveClass("dark:border-interactive");
  });

  it("opens, focuses, and closes its search field from the keyboard", async () => {
    const user = userEvent.setup();
    render(<KpiSearchButton value="" onChange={() => undefined} placeholder="앱 검색" />);

    const trigger = screen.getByRole("button", { name: "앱 검색" });
    await user.click(trigger);
    const input = screen.getByRole("searchbox", { name: "앱 검색" });
    await waitFor(() => expect(input).toHaveFocus());
    expect(input.closest(".absolute")).toHaveClass(
      "right-[calc(-1*var(--container-pad-sm))]",
      "w-[min(380px,calc(100vw-2rem))]",
      "sm:right-0",
      "sm:w-[380px]",
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("searchbox", { name: "앱 검색" })).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("keeps focus on the outside control that dismissed search", async () => {
    const user = userEvent.setup();
    render(
      <>
        <KpiSearchButton value="" onChange={() => undefined} />
        <button type="button">외부 작업</button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "검색" }));
    const outside = screen.getByRole("button", { name: "외부 작업" });
    await user.click(outside);

    expect(screen.queryByRole("searchbox", { name: "검색" })).not.toBeInTheDocument();
    expect(outside).toHaveFocus();
  });
});
