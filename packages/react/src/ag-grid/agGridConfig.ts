import {
  colorSchemeDark,
  themeQuartz,
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export const GRID_ROW_HEIGHT = 40;
export const GRID_RADIUS = 10;

export const GRID_DEFAULT_COL: ColDef = {
  sortable: true,
  resizable: true,
  suppressHeaderMenuButton: true,
};

export const GRID_NO_EXTERNAL_FONTS = { loadThemeGoogleFonts: false } as const;

export const axGridTheme = themeQuartz.withParams({
  fontFamily: "var(--font-sans)",
  wrapperBorderRadius: GRID_RADIUS,
  backgroundColor: "var(--bg-content)",
  headerBackgroundColor: "var(--bg-surface)",
  borderColor: "var(--border-default)",
  rowHoverColor: "var(--bg-muted)",
  pickerButtonBorderRadius: "var(--radius-button-sm)",
  inputBorderRadius: "var(--radius-button-sm)",
});

export const axGridThemeDark = axGridTheme.withPart(colorSchemeDark).withParams({
  backgroundColor: "var(--bg-content)",
  headerBackgroundColor: "var(--bg-surface)",
  borderColor: "var(--border-default)",
  rowHoverColor: "var(--bg-muted)",
});

export const GRID_LOCALE_KO: Record<string, string> = {
  noRowsToShow: "표시할 항목이 없어요",
  loadingOoo: "불러오는 중…",
  page: "페이지",
  of: "/",
  to: "–",
  more: "?",
  firstPage: "첫 페이지",
  previousPage: "이전 페이지",
  nextPage: "다음 페이지",
  lastPage: "마지막 페이지",
  pageSizeSelectorLabel: "페이지 크기:",
  ariaPageSizeSelectorLabel: "페이지 크기",
  ariaSortableColumn: "정렬하려면 누르세요",
};
