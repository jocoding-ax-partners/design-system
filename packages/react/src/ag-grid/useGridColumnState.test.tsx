import type { GridApi, GridReadyEvent, NewColumnsLoadedEvent } from "ag-grid-community";

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { parseStoredWidths, pickWidths, useGridColumnState } from "./useGridColumnState.js";

describe("grid column width persistence", () => {
  beforeEach(() => localStorage.clear());

  it("accepts only finite stored column widths", () => {
    expect(
      parseStoredWidths(
        JSON.stringify([
          { colId: "name", width: 180 },
          { colId: "bad", width: "wide" },
          { width: 90 },
          null,
        ]),
      ),
    ).toEqual([{ colId: "name", width: 180 }]);
    expect(parseStoredWidths("not json")).toEqual([]);
  });

  it("does not freeze untouched flex columns to their current pixel width", () => {
    expect(
      pickWidths([
        { colId: "fixed", width: 160, flex: null },
        { colId: "fluid", width: 420, flex: 1 },
      ]),
    ).toEqual([{ colId: "fixed", width: 160 }]);
  });

  it("persists widths only after a completed user resize", () => {
    const { result } = renderHook(() => useGridColumnState("grid-widths"));
    const api = {
      getColumnState: () => [
        { colId: "fixed", width: 172, flex: null },
        { colId: "fluid", width: 400, flex: 1 },
      ],
    } as unknown as GridApi;

    act(() => result.current.onGridReady({ api } as GridReadyEvent));
    act(() =>
      result.current.onColumnResized({
        api,
        finished: true,
        source: "uiColumnResized",
      } as Parameters<typeof result.current.onColumnResized>[0]),
    );

    expect(localStorage.getItem("grid-widths")).toBe('[{"colId":"fixed","width":172}]');
  });

  it("restores stored pixels without changing columns absent from storage", () => {
    localStorage.setItem("grid-widths", '[{"colId":"name","width":208}]');
    const applyColumnState = vi.fn();
    const api = { applyColumnState } as unknown as GridApi;
    const { result } = renderHook(() => useGridColumnState("grid-widths"));

    act(() => result.current.onNewColumnsLoaded({ api } as NewColumnsLoadedEvent));

    expect(applyColumnState).toHaveBeenCalledWith({
      state: [{ colId: "name", width: 208, flex: null }],
    });
  });
});
