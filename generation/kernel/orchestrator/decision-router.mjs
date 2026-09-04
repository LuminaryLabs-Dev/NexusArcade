import { resolveSelector } from "./execution-tree.mjs";

export function chooseBranch(node, context) {
  const value = String(resolveSelector(node.selector, context) ?? "");
  const selected = node.cases[value] ?? node.default;
  if (!selected)
    throw new Error(
      `decision '${node.id ?? node.selector}' has no case for '${value}'`,
    );
  return { value, selected };
}
