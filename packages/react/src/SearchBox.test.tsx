import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchBox } from "./SearchBox";

describe("SearchBox", () => {
  it("reports what the user typed", async () => {
    const onChange = vi.fn();
    render(<SearchBox value="" onChange={onChange} placeholder="검색" />);
    await userEvent.type(screen.getByPlaceholderText("검색"), "가");
    expect(onChange).toHaveBeenCalledWith("가");
  });

  it("clears immediately via the clear button, bypassing debounce", async () => {
    const onChange = vi.fn();
    render(<SearchBox value="검색어" onChange={onChange} placeholder="검색" debounceMs={500} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
