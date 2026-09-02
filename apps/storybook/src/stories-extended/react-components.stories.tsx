import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  useConfirm,
  useHoverReadout,
  CodeBlock,
  ConfirmProvider,
  HoverReadout,
  Input,
  List,
  ListItem,
  Pagination,
  ReadoutSurface,
  SearchBox,
  SidePanel,
  SidePanelFooter,
  SidePanelHeader,
  SkeletonRow,
  StatusDot,
  StatCard,
} from "@jocoding-ax-partners/react";
import { useState } from "react";

const meta = {
  title: "Extended/React components",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

// ConfirmDialog is exported as a provider + hook (ConfirmProvider / useConfirm), not a
// standalone <ConfirmDialog> component — see the divergence list in the task-8 report.
function ConfirmDemo() {
  const confirm = useConfirm();
  const [result, setResult] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        type="button"
        onClick={async () => {
          const ok = await confirm({
            title: "삭제할까요",
            description: "되돌릴 수 없어요.",
            confirmLabel: "삭제",
            variant: "danger",
          });
          setResult(ok ? "confirmed" : "cancelled");
        }}
      >
        ConfirmDialog 열기
      </button>
      {result && <p>result: {result}</p>}
    </div>
  );
}

export const Gallery: StoryObj = {
  render: function Gallery() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    return (
      <ConfirmProvider>
        <div style={{ display: "grid", gap: 24, maxWidth: 720 }}>
          <SearchBox value={query} onChange={setQuery} placeholder="검색" />
          <Input label="이름" placeholder="입력하세요" />
          <div style={{ display: "flex", gap: 16 }}>
            <StatCard label="응시자" value={128} />
            <StatCard label="합격률" value="72%" />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <StatusDot tone="active">운영중</StatusDot>
            <StatusDot tone="warning">점검중</StatusDot>
            <StatusDot tone="failed">중단</StatusDot>
          </div>
          <CodeBlock code={"const answer = 42;\nconsole.log(answer);"} language="ts" />
          <SkeletonRow />
          <Pagination page={page} pageCount={9} onChange={setPage} />
          <ConfirmDemo />
        </div>
      </ConfirmProvider>
    );
  },
};

// List/HoverReadout/SidePanel each occupy their own layout (a full list column, an
// absolutely-positioned tooltip surface, a slide-in panel) — folding them into the
// Gallery above would have them cover or fight the other components, so each gets its
// own story per the brief's note.

export const ListDemo: StoryObj = {
  render: function ListDemo() {
    const [selected, setSelected] = useState(0);
    const items = ["가나다 신청서", "라마바 신청서", "사아자 신청서"];

    return (
      <div style={{ maxWidth: 320 }}>
        <List>
          {items.map((label, i) => (
            <ListItem key={label} selected={i === selected} onClick={() => setSelected(i)}>
              {label}
            </ListItem>
          ))}
        </List>
      </div>
    );
  },
};

export const HoverReadoutDemo: StoryObj = {
  render: function HoverReadoutDemo() {
    const { hide, ref, show, spot } = useHoverReadout();

    return (
      <ReadoutSurface surfaceRef={ref} onMouseLeave={hide}>
        <div
          style={{ width: 120, height: 40, background: "var(--primary)", borderRadius: 6 }}
          onMouseEnter={(e) => show(e.currentTarget, "9월 3일", "12건")}
        />
        <HoverReadout spot={spot} />
      </ReadoutSurface>
    );
  },
};

export const SidePanelDemo: StoryObj = {
  render: function SidePanelDemo() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          SidePanel 열기
        </button>
        <SidePanel
          open={open}
          onOpenChange={setOpen}
          title="상세"
          header={<SidePanelHeader title="상세 정보" description="선택한 항목의 세부 내용" />}
          footer={
            <SidePanelFooter>
              <button type="button" onClick={() => setOpen(false)}>
                닫기
              </button>
            </SidePanelFooter>
          }
        >
          <p>패널 본문</p>
        </SidePanel>
      </>
    );
  },
};
