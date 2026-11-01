import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  canvasClass,
  Card,
  CardEmpty,
  NavList,
  PageContainer,
  Rail,
  RailTile,
  Sidebar,
  TopBar,
} from "@jocoding-ax-partners/react";
import { Gear, House, SquaresFour, UsersThree } from "@phosphor-icons/react";

/* 세 제품(콘솔 · admin · axclass 운영)이 같이 쓰는 셸. 정본은 콘솔(jocodingax.axhub.ai)이다. */

function AdminShell() {
  return (
    <div className="flex h-[560px] flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      <TopBar
        rail={<div className="px-5 text-[16px] font-bold">AXHub Admin</div>}
        leading={<span className="text-[15px] font-semibold">대시보드</span>}
        actions={<span className="text-muted text-[13px]">admin@jocodingax.ai</span>}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar className="flex">
          <NavList
            aria-label="관리자 메뉴"
            sections={[
              {
                key: "main",
                items: [
                  { key: "home", href: "#", icon: SquaresFour, label: "대시보드", active: true },
                  { key: "users", href: "#", icon: UsersThree, label: "사용자" },
                  { key: "settings", href: "#", icon: Gear, label: "설정" },
                ],
              },
            ]}
          />
        </Sidebar>
        <main className={`${canvasClass} min-w-0 flex-1 overflow-y-auto`}>
          <PageContainer className="grid gap-4">
            <Card>
              <div className="text-[15px] font-semibold">영역 카드</div>
              <p className="text-muted mt-1 text-[14px]">반경 12 · 패딩 16 · border-default</p>
            </Card>
            <Card padding="none">
              <CardEmpty>표시할 항목이 없습니다</CardEmpty>
            </Card>
          </PageContainer>
        </main>
      </div>
    </div>
  );
}

function MemberRail() {
  const icon = (I: typeof House) => (active: boolean) => (
    <I size={24} weight={active ? "fill" : "regular"} aria-hidden="true" />
  );
  return (
    <div className="bg-canvas p-8">
      <Rail className="w-fit" footer={<RailTile href="#" label="설정" renderIcon={icon(Gear)} />}>
        <RailTile href="#" label="홈" renderIcon={icon(House)} active />
        <RailTile href="#" label="앱" renderIcon={icon(SquaresFour)} />
        <RailTile href="#" label="멤버" renderIcon={icon(UsersThree)} />
      </Rail>
    </div>
  );
}

const meta = {
  title: "Extended/Shell",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const AdminConsole: StoryObj = { render: () => <AdminShell /> };

export const MemberRailTiles: StoryObj = { render: () => <MemberRail /> };
