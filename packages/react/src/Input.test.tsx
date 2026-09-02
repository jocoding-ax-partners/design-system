import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders its label and accepts typed input", async () => {
    render(<Input label="이름" placeholder="입력하세요" />);
    const field = screen.getByLabelText("이름");
    await userEvent.type(field, "홍길동");
    expect(field).toHaveValue("홍길동");
  });

  it("marks the field invalid and shows the error text", () => {
    render(<Input label="이름" errorText="필수 항목이에요" />);
    expect(screen.getByText("필수 항목이에요")).toBeInTheDocument();
    expect(screen.getByLabelText("이름")).toHaveAttribute("aria-invalid", "true");
  });
});
