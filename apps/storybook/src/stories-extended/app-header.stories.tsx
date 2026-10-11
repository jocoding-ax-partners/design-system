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

/**
 * AxLMS 식 — 운영자 표면. 햄버거(로고 앞)·brandTag·badge·`soft` 지금 칸 표시·굵은 폭 예약,
 * 머리 표면을 앱 CSS 가 `data-scrolled` 로 바꾸게 열어 두고(여기서는 맨 위 투명 흉내),
 * 계정 버튼·메뉴에 안내 투어용 `data-admin-guide` 를 싣는다. 투어 오버레이
 * (`[data-admin-guide-overlay]`) 를 눌러도 메뉴는 닫히지 않고, 열림은 앱이 제어한다.
 */
export const AxLMSStyle: Story = {
  name: "AxLMS 식",
  args: {
    accountItems: [SETTINGS, { label: "학습자 화면", href: "/" }],
  },
  render: (args) => {
    function AxLMSDemo() {
      const [open, setOpen] = useState(false);
      return (
        <div style={{ minHeight: 420 }}>
          <AppHeader
            {...args}
            nav={[
              { label: "강의", href: "/admin/courses", active: true },
              { label: "회사", href: "/admin/tenants", badge: 6 },
              { label: "할 일", href: "/admin/todo" },
            ]}
            renderLink={(p) => <a {...p} onClick={(e) => e.preventDefault()} />}
            leadingStart={
              <button
                type="button"
                aria-label="메뉴 열기"
                className="-ml-1 flex size-11 items-center justify-center rounded-lg md:hidden"
              >
                ≡
              </button>
            }
            brandTag="관리자"
            navActiveVariant="soft"
            navReserveBoldWidth
            dataAttrs={{ "data-scrolled": "false" }}
            className="bg-transparent lg:border-b-0"
            classNames={{
              inner: "px-3 sm:px-5",
              accountMenu: "shadow-[var(--surface-shadow,var(--overlay-shadow))]",
              accountRow: "text-[var(--muted)]",
              accountEmail: "text-[var(--muted-soft,var(--muted))]",
            }}
            accountButtonProps={{ "data-admin-guide": "account" }}
            accountMenuProps={{ "data-admin-guide": "account-menu" }}
            accountMenuOpen={open}
            onAccountMenuOpenChange={setOpen}
            outsideClickIgnore="[data-admin-guide-overlay]"
          />
          <div data-admin-guide-overlay="" style={{ padding: 20 }}>
            <button type="button" onClick={() => setOpen(true)}>
              안내: 계정 메뉴 열기
            </button>
          </div>
        </div>
      );
    }
    return <AxLMSDemo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("banner");
    await expect(bar).toHaveAttribute("data-scrolled", "false");
    await expect(canvas.getByText("관리자")).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: /강의/ })).toHaveAttribute(
      "aria-current",
      "page",
    );

    const button = canvas.getByRole("button", { name: "계정 메뉴 · 김하늘" });
    await expect(button).toHaveAttribute("data-admin-guide", "account");
    // 안내 투어(오버레이 안)가 메뉴를 연다 — 오버레이를 누른 건 바깥 누름이 아니다.
    await userEvent.click(canvas.getByRole("button", { name: "안내: 계정 메뉴 열기" }));
    const menu = await canvas.findByRole("menu");
    await expect(menu).toHaveAttribute("data-admin-guide", "account-menu");
    await userEvent.click(canvas.getByRole("button", { name: "안내: 계정 메뉴 열기" }));
    await expect(canvas.getByRole("menu")).toBeInTheDocument();
    // 오버레이 밖을 누르면 닫는다.
    await userEvent.click(canvas.getByText("관리자"));
    await waitFor(() => expect(canvas.queryByRole("menu")).toBeNull());
  },
};
