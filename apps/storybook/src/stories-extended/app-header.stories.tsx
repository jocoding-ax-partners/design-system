import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppHeader, type AppHeaderProps } from "@jocoding-ax-partners/react";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

const SETTINGS = {
  label: "계정 설정",
  href: "https://acme.axhub.ai/settings/profile",
  external: true,
};

function Logo() {
  return <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>APTA</span>;
}

/** 스토리 안에서는 링크가 화면을 떠나지 않게 막고, 고른 항목을 아래에 적는다. */
function Demo(props: Omit<AppHeaderProps, "renderLink">) {
  const [last, setLast] = useState("");
  return (
    <div style={{ minHeight: 420 }}>
      <AppHeader
        {...props}
        renderLink={(p) => (
          <a
            {...p}
            onClick={(e) => {
              e.preventDefault();
              setLast(p.href);
            }}
          />
        )}
      />
      <p style={{ padding: 20 }} data-testid="picked">
        {last ? `picked: ${last}` : ""}
      </p>
    </div>
  );
}

const meta = {
  title: "Extended/AppHeader",
  component: Demo,
  parameters: { layout: "fullscreen" },
  args: {
    logo: <Logo />,
    nav: [
      { label: "응시 현황", href: "/", active: true },
      { label: "도움말", href: "/help" },
    ],
    user: { name: "김하늘", email: "sky@acme.com" },
    accountItems: [SETTINGS],
    onLogout: fn(),
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 일반 응시자 — 계정 설정·로그아웃만. 키보드로 열고 돌고 닫는다. */
export const Member: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "계정 메뉴 · 김하늘" });

    button.focus();
    await userEvent.keyboard("{Enter}");
    const menu = await canvas.findByRole("menu");
    const items = within(menu).getAllByRole("menuitem");
    await expect(items).toHaveLength(2);
    await expect(items[0]).toHaveFocus();
    await expect(items[0]).toHaveAttribute("target", "_blank");

    await userEvent.keyboard("{ArrowDown}");
    await expect(within(menu).getByRole("menuitem", { name: "로그아웃" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).toBeNull());
    await expect(button).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    await userEvent.keyboard("{Enter}");
    await expect(args.onLogout).toHaveBeenCalledTimes(1);
  },
};

/** 고객사 관리자 — 앱이 「관리자 페이지」 한 줄을 더 넘긴다. 마우스로 고른다. */
export const Admin: Story = {
  args: {
    accountItems: [SETTINGS, { label: "관리자 페이지", href: "/manage" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /계정 메뉴/ }));
    const menu = await canvas.findByRole("menu");
    await expect(within(menu).getAllByRole("menuitem")).toHaveLength(3);
    await userEvent.click(within(menu).getByRole("menuitem", { name: "관리자 페이지" }));
    await waitFor(() => expect(canvas.queryByRole("menu")).toBeNull());
    await expect(canvas.getByTestId("picked")).toHaveTextContent("picked: /manage");
  },
};

/**
 * 좁은 화면 — md 미만에서 상단 메뉴가 숨고 계정 메뉴가 바텀시트로 뜬다.
 * Storybook 툴바의 viewport 로 폭을 줄여 본다(기본값 mobile1).
 */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  args: {
    accountItems: [SETTINGS, { label: "관리자 페이지", href: "/manage" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /계정 메뉴/ }));
    const menu = await canvas.findByRole("menu");
    await expect(menu.className).toContain("bottom-0");
    await userEvent.keyboard("{End}");
    await expect(within(menu).getByRole("menuitem", { name: "로그아웃" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).toBeNull());
  },
};
