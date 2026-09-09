import { describe, expect, it } from "vitest";

import { AgDataGrid } from "./AgDataGrid.js";
import {
  axGridTheme,
  axGridThemeDark,
  GRID_DEFAULT_COL,
  GRID_LOCALE_KO,
  GRID_ROW_HEIGHT,
} from "./agGridConfig.js";

describe("AgDataGrid", () => {
  it("applies the canonical defaults and explicit light theme", () => {
    const element = AgDataGrid<{ name: string }>({ isDark: false, rowData: [{ name: "APTA" }] });

    expect(element.props.theme).toBe(axGridTheme);
    expect(element.props.rowHeight).toBe(GRID_ROW_HEIGHT);
    expect(element.props.headerHeight).toBe(GRID_ROW_HEIGHT);
    expect(element.props.defaultColDef).toBe(GRID_DEFAULT_COL);
    expect(element.props.domLayout).toBe("autoHeight");
    expect(element.props.enableCellTextSelection).toBe(true);
    expect(element.props.loadThemeGoogleFonts).toBe(false);
    expect(element.props.localeText).toBe(GRID_LOCALE_KO);
  });

  it("uses the explicit dark theme while preserving caller overrides", () => {
    const element = AgDataGrid({ isDark: true, rowHeight: 56 });

    expect(element.props.theme).toBe(axGridThemeDark);
    expect(element.props.rowHeight).toBe(56);
  });
});
