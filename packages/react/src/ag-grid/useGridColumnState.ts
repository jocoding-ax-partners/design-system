import type {
  ColumnResizedEvent,
  GridApi,
  GridReadyEvent,
  NewColumnsLoadedEvent,
} from "ag-grid-community";

import { useCallback, useRef } from "react";

export interface StoredColWidth {
  colId: string;
  width: number;
}

export function parseStoredWidths(raw: string | null): StoredColWidth[] {
  if (!raw) {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.flatMap((item) => {
    if (typeof item !== "object" || item === null) {
      return [];
    }
    const { colId, width } = item as { colId?: unknown; width?: unknown };
    return typeof colId === "string" && typeof width === "number" && Number.isFinite(width)
      ? [{ colId, width }]
      : [];
  });
}

export function pickWidths(
  state: { colId: string; width?: number | null; flex?: number | null }[],
): StoredColWidth[] {
  return state.flatMap((column) =>
    column.flex == null && typeof column.width === "number" && Number.isFinite(column.width)
      ? [{ colId: column.colId, width: column.width }]
      : [],
  );
}

export function useGridColumnState(storageKey: string) {
  const apiRef = useRef<GridApi | null>(null);

  const applyStoredWidths = useCallback(
    (api: GridApi) => {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(storageKey);
      } catch {
        // Storage may be unavailable; the grid remains usable without persistence.
      }
      const state = parseStoredWidths(raw);
      if (state.length) {
        api.applyColumnState({
          state: state.map(({ colId, width }) => ({ colId, width, flex: null })),
        });
      }
    },
    [storageKey],
  );

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      apiRef.current = event.api;
      applyStoredWidths(event.api);
    },
    [applyStoredWidths],
  );

  const onNewColumnsLoaded = useCallback(
    (event: NewColumnsLoadedEvent) => {
      apiRef.current = event.api;
      applyStoredWidths(event.api);
    },
    [applyStoredWidths],
  );

  const onColumnResized = useCallback(
    (event: ColumnResizedEvent) => {
      if (!event.finished || event.source !== "uiColumnResized" || !apiRef.current) {
        return;
      }
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify(pickWidths(apiRef.current.getColumnState())),
        );
      } catch {
        // Storage failures must not break column resizing.
      }
    },
    [storageKey],
  );

  return { onGridReady, onNewColumnsLoaded, onColumnResized };
}
