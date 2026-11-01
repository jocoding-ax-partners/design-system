import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminShell } from "./AdminShell.js";
import { PageHeader } from "./PageHeader.js";

function renderShell(closeKey?: string) {
  return render(
    <AdminShell
      brand={<span>BRAND</span>}
      nav={
        <nav aria-label="관리자 메뉴">
          <a href="/a">메뉴 A</a>
        </nav>
      }
      sidebarHeader={<input aria-label="메뉴 검색" />}
      sidebarFooter={<span>계정</span>}
      topbarActions={<button type="button">알림</button>}
      closeKey={closeKey}
    >
      <p>본문</p>
    </AdminShell>,
  );
}

describe("AdminShell", () => {
  it("GNB(60px TopBar) 아래에 사이드바와 캔버스 본문을 놓는다", () => {
    const { container } = renderShell();
    const header = container.querySelector("header") as HTMLElement;
    expect(header.className).toContain("h-[var(--topbar-height)]");
    expect(screen.getByRole("button", { name: "알림" })).toBeInTheDocument();

    const main = screen.getByRole("main");
    expect(main.className).toContain("bg-canvas");
    expect(main).toHaveTextContent("본문");

    // 사이드바는 Sidebar 컴포넌트 그대로 — 폭 토큰과 lg 미만 숨김.
    const sidebar = main.previousElementSibling as HTMLElement;
    expect(sidebar.className).toContain("w-[var(--sidebar-width)]");
    expect(sidebar.className).toContain("hidden");
    expect(sidebar).toHaveTextContent("메뉴 A");
    expect(sidebar).toHaveTextContent("계정");
  });

  it("모바일 메뉴 버튼이 같은 nav 를 드로어로 열고, 링크를 누르면 닫는다", () => {
    renderShell();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
    const dialog = screen.getByRole("dialog", { name: "메뉴" });
    expect(dialog).toHaveTextContent("메뉴 A");
    expect(dialog).toHaveTextContent("계정");

    fireEvent.click(dialog.querySelector("a") as HTMLElement);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Escape 와 closeKey 변경으로 드로어를 닫는다", () => {
    const { rerender } = renderShell("/a");
    fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
    rerender(
      <AdminShell brand="B" nav={<nav />} closeKey="/b">
        x
      </AdminShell>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("PageHeader density=compact", () => {
  it("관리자 정본 — 56px 한 줄, 제목 24px, 설명 14px", () => {
    const { container } = render(
      <PageHeader
        density="compact"
        title="테넌트"
        description="설명"
        actions={<button type="button">추가</button>}
      />,
    );
    const row = container.querySelector(".h-14") as HTMLElement;
    expect(row.className).toBe("flex h-14 shrink-0 items-center justify-between gap-6");
    expect(screen.getByRole("heading", { level: 1 }).className).toContain("text-2xl");
    expect(screen.getByText("설명").className).toBe("text-muted -mt-1 text-sm");
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
  });
});

describe("AdminShell surfaceClassName", () => {
  it("GNB·사이드바·드로어 면에 같이 붙는다", () => {
    const { container } = render(
      <AdminShell brand="B" nav={<nav />} surfaceClassName="bg-[var(--surface)]">
        x
      </AdminShell>,
    );
    expect((container.querySelector("header") as HTMLElement).className).toContain(
      "bg-[var(--surface)]",
    );
    expect((screen.getByRole("main").previousElementSibling as HTMLElement).className).toContain(
      "bg-[var(--surface)]",
    );
    fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
    expect(
      (screen.getByRole("dialog").querySelector(".shadow-2xl") as HTMLElement).className,
    ).toContain("bg-[var(--surface)]");
  });
});
