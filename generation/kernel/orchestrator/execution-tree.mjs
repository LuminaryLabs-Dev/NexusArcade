export function resolveSelector(selector, context) {
  return String(selector)
    .split(".")
    .reduce((value, key) => value?.[key], context);
}

export function summarizeTree(tree) {
  const counts = { sequence: 0, core: 0, chain: 0, decision: 0 };
  const visit = (node) => {
    counts[node.type] += 1;
    if (node.type === "sequence") node.children.forEach(visit);
    if (node.type === "decision") {
      Object.values(node.cases).forEach(visit);
      if (node.default) visit(node.default);
    }
  };
  visit(tree);
  return counts;
}
