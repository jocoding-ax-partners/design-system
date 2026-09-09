import { AgGridReact, type AgGridReactProps } from "ag-grid-react";

import {
  axGridTheme,
  axGridThemeDark,
  GRID_DEFAULT_COL,
  GRID_LOCALE_KO,
  GRID_NO_EXTERNAL_FONTS,
  GRID_ROW_HEIGHT,
} from "./agGridConfig.js";
import "./agGrid.css";

export type AgDataGridProps<TData> = Omit<AgGridReactProps<TData>, "theme"> & {
  isDark: boolean;
};

export function AgDataGrid<TData>({ isDark, ...props }: AgDataGridProps<TData>) {
  return (
    <AgGridReact<TData>
      theme={isDark ? axGridThemeDark : axGridTheme}
      rowHeight={GRID_ROW_HEIGHT}
      headerHeight={GRID_ROW_HEIGHT}
      defaultColDef={GRID_DEFAULT_COL}
      domLayout="autoHeight"
      enableCellTextSelection
      localeText={GRID_LOCALE_KO}
      {...GRID_NO_EXTERNAL_FONTS}
      {...props}
    />
  );
}
