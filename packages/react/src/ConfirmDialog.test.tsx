import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { useConfirm, ConfirmProvider } from "./ConfirmDialog.js";

function Harness() {
  const confirm = useConfirm();
  const [result, setResult] = useState<string>("idle");
  return (
    <div>
      <p>result: {result}</p>
      <button
        type="button"
        onClick={async () => {
          const ok = await confirm({ title: "삭제할까요", confirmLabel: "삭제" });
          setResult(ok ? "confirmed" : "cancelled");
        }}
      >
        열기
      </button>
    </div>
  );
}

describe("ConfirmDialog (ConfirmProvider / useConfirm)", () => {
  it("resolves true when the confirm action is pressed", async () => {
    render(
      <ConfirmProvider>
        <Harness />
      </ConfirmProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "열기" }));
    expect(screen.getByText("삭제할까요")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "삭제" }));
    expect(await screen.findByText("result: confirmed")).toBeInTheDocument();
  });

  it("throws if useConfirm is called outside a ConfirmProvider", () => {
    function Bare() {
      useConfirm();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/ConfirmProvider/);
  });
});
