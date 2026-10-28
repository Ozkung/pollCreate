import type { CSSProperties } from "react";

const CATEGORY_COLORS = [
  "--cat-yellow",
  "--cat-pink",
  "--cat-purple",
  "--cat-green",
  "--cat-blue",
  "--cat-orange",
];

/** Inline style that sets `--cat` to the category colour for item `index`. */
export function catStyle(index: number): CSSProperties {
  const name = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  return { "--cat": `var(${name})` } as CSSProperties;
}
