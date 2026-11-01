import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  canvasClass,
  AdminShell as AdminFrame,
  Card,
  CardEmpty,
  NavList,
  PageContainer,
  PageHeader,
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

/* 관리자 화면 틀 — 정본 admin.axhub.ai. 앱은 brand·nav·계정만 채운다. */
function AdminFrameStory() {
  return (
    <div className="h-[560px] [&>div]:h-full" style={{ fontFamily: "var(--font-sans)" }}>
      <AdminFrame
        brand={<span className="text-[16px] font-bold">AXHub Admin</span>}
        topbarActions={<span className="text-muted text-[13px]">admin@jocodingax.ai</span>}
        sidebarFooter={
          <div className="border-border border-t p-3 text-[13px]">김관리 · 로그아웃</div>
        }
        nav={
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
        }
      >
        <PageHeader density="compact" title="대시보드" description="한 줄 설명" />
        <div className="mt-8 grid gap-4">
          <Card>
            <div className="text-[15px] font-semibold">영역 카드</div>
          </Card>
        </div>
      </AdminFrame>
    </div>
  );
}

/* 부모도 자기 화면이 있는 메뉴: 부모는 링크, 펼침은 캐럿 버튼, 자식이 활성이면 저절로 펼쳐진다. */
function LinkedParent() {
  return (
    <Sidebar className="flex h-[320px] w-64">
      <NavList
        aria-label="주 메뉴"
        className="px-2"
        sections={[
          {
            key: "work",
            label: "업무",
            items: [
              { key: "home", href: "#", label: "홈", icon: House },
              {
                key: "projects",
                href: "#",
                label: "프로젝트",
                icon: SquaresFour,
                active: true,
                parentLink: true,
                expandWhenActive: true,
                children: [
                  { key: "si", href: "#", label: "SI 프로젝트", active: true },
                  { key: "own", href: "#", label: "자사 프로젝트" },
                ],
              },
            ],
          },
        ]}
      />
    </Sidebar>
  );
}

/* 경로로 보이는 하위 메뉴: 프로젝트 화면에서만 SI·자사가 보이고, 접을 수 없다. */
function RouteChildrenNav() {
  return (
    <Sidebar className="flex h-[320px] w-64">
      <NavList
        aria-label="주 메뉴"
        className="px-2"
        sections={[
          {
            key: "work",
            label: "업무",
            items: [
              { key: "home", href: "#", label: "홈", icon: House },
              {
                key: "projects",
                href: "#",
                label: "프로젝트",
                icon: SquaresFour,
                showChildren: true,
                className: "font-semibold",
                children: [
                  { key: "si", href: "#", label: "SI 프로젝트", active: true },
                  { key: "own", href: "#", label: "자사 프로젝트" },
                ],
              },
            ],
          },
        ]}
      />
    </Sidebar>
  );
}

const meta = {
  title: "Extended/Shell",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const NavRouteChildren: StoryObj = { render: () => <RouteChildrenNav /> };

export const NavLinkedParent: StoryObj = { render: () => <LinkedParent /> };

export const AdminShellFrame: StoryObj = { render: () => <AdminFrameStory /> };

export const AdminConsole: StoryObj = { render: () => <AdminShell /> };

export const MemberRailTiles: StoryObj = { render: () => <MemberRail /> };
