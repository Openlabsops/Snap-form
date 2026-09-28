import { describe, it, expect } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { useDebounce } from "./use-debounce";

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    let debounced!: string;
    function TestComponent() {
      debounced = useDebounce("hello", 300);
      return React.createElement("div", null, debounced);
    }

    renderToString(React.createElement(TestComponent));
    expect(debounced).toBe("hello");
  });

  it("handles different types like numbers and objects", () => {
    let debouncedNum!: number;
    function NumComponent() {
      debouncedNum = useDebounce(42, 100);
      return React.createElement("div", null, String(debouncedNum));
    }

    renderToString(React.createElement(NumComponent));
    expect(debouncedNum).toBe(42);
  });
});
