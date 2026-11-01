import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { railTileClass, Rail, RailTile } from "./Rail.js";

const icon = (active: boolean) => <svg data-testid="icon" data-active={String(active)} />;

describe("Rail", () => {
  it("주 메뉴 nav 랜드마크이고, footer 를 주면 구분선이 생긴다", () => {
    render(
      <Rail footer={<span>설정</span>}>
        <span>홈</span>
      </Rail>,
    );
    expect(screen.getByRole("navigation", { name: "주 메뉴" })).toBeTruthy();
    expect(screen.getByRole("separator")).toBeTruthy();
  });

  it("footer 가 없으면 구분선도 없다", () => {
    render(
      <Rail>
        <span>홈</span>
      </Rail>,
    );
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("활성 타일은 primary 글자 + aria-current, 비활성은 gray-400", () => {
    render(
      <>
        <RailTile href="/apps" label="앱" renderIcon={icon} active />
        <RailTile href="/data" label="데이터" renderIcon={icon} />
      </>,
    );
    const on = screen.getByRole("link", { name: "앱" });
    expect(on.getAttribute("aria-current")).toBe("page");
    expect(on.className).toContain("text-primary");
    expect(screen.getByRole("link", { name: "데이터" }).className).toContain("text-gray-400");
    expect(screen.getAllByTestId("icon")[0]?.getAttribute("data-active")).toBe("true");
  });

  it("href 가 없으면 링크 없이 모습만 그린다(미리보기)", () => {
    render(<RailTile label="앱" renderIcon={icon} active />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("앱").parentElement?.className).toBe(railTileClass(true));
  });

  it("dataAttrs 는 구조적 prop 을 덮지 못한다", () => {
    render(
      <RailTile
        href="/apps"
        label="앱"
        renderIcon={icon}
        dataAttrs={{ "data-tutorial": "nav:/apps" }}
      />,
    );
    const link = screen.getByRole("link", { name: "앱" });
    expect(link.getAttribute("data-tutorial")).toBe("nav:/apps");
    expect(link.getAttribute("href")).toBe("/apps");
  });
});
