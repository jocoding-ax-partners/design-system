import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { cardClass, cardFlushClass, Card, CardEmpty } from "./Card.js";

describe("Card", () => {
  it("정본 consoleCard.ts 의 CONSOLE_CARD 와 한 글자도 다르지 않다", () => {
    expect(cardClass).toBe("bg-content border-default rounded-xl border p-4");
    expect(cardFlushClass).toBe("bg-content border-default overflow-hidden rounded-xl border");
  });

  it("기본은 패딩 있는 div 다", () => {
    render(<Card>본문</Card>);
    const root = screen.getByText("본문");
    expect(root.tagName).toBe("DIV");
    expect(root.className).toBe(cardClass);
  });

  it("padding=none 은 flush 박스, as 로 요소를 바꾼다", () => {
    render(
      <Card padding="none" as="section">
        표
      </Card>,
    );
    const root = screen.getByText("표");
    expect(root.tagName).toBe("SECTION");
    expect(root.className).toBe(cardFlushClass);
  });

  it("className 이 기본을 이긴다", () => {
    render(<Card className="p-6">넓게</Card>);
    expect(screen.getByText("넓게").className).toContain("p-6");
    expect(screen.getByText("넓게").className).not.toContain("p-4");
  });

  it("CardEmpty 는 읽히는 보조색으로 가운데 정렬한다", () => {
    render(<CardEmpty>없습니다</CardEmpty>);
    const root = screen.getByText("없습니다");
    expect(root.className).toContain("text-center");
    expect(root.className).toContain("text-muted");
  });
});
