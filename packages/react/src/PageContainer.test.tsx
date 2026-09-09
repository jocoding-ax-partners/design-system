import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageContainer } from "./PageContainer.js";

describe("PageContainer", () => {
  it("정본 바깥 여백을 소유한다 — 1280 max-width, pt-10, pb-[120px]", () => {
    render(
      <PageContainer>
        <span>본문</span>
      </PageContainer>,
    );
    const root = screen.getByText("본문").parentElement as HTMLElement;
    expect(root.className).toContain("max-w-[1280px]");
    expect(root.className).toContain("px-container");
    expect(root.className).toContain("pt-10");
    expect(root.className).toContain("pb-[120px]");
  });

  it("클래스 문자열이 정본과 한 글자도 다르지 않다 — layout/PageContainer.tsx:33", () => {
    const { container } = render(
      <PageContainer>
        <span>본문</span>
      </PageContainer>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("DIV");
    expect(root.className).toBe("px-container mx-auto w-full max-w-[1280px] pt-10 pb-[120px]");
    // 정본은 div 하나다 — 래퍼가 하나 더 생기면 여백 소유자가 둘이 된다.
    expect(root.children).toHaveLength(1);
  });

  it("className 이 기본을 이긴다", () => {
    render(
      <PageContainer className="pt-0">
        <span>본문</span>
      </PageContainer>,
    );
    const root = screen.getByText("본문").parentElement as HTMLElement;
    expect(root.className).toContain("pt-0");
    expect(root.className).not.toMatch(/\bpt-10\b/);
  });
});
