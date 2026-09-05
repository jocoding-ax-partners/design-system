import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { List, ListItem } from "./List.js";

describe("List", () => {
  it("renders its items", () => {
    render(
      <List>
        <ListItem>첫 항목</ListItem>
        <ListItem>둘째 항목</ListItem>
      </List>,
    );
    expect(screen.getByText("첫 항목")).toBeInTheDocument();
    expect(screen.getByText("둘째 항목")).toBeInTheDocument();
  });

  it("fires onClick and marks the selected item as aria-current", async () => {
    const onClick = vi.fn();
    render(
      <List>
        <ListItem selected onClick={onClick}>
          선택됨
        </ListItem>
      </List>,
    );
    const item = screen.getByRole("button", { name: "선택됨" });
    expect(item).toHaveAttribute("aria-current", "true");
    await userEvent.click(item);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
