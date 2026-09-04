const TYPES = new Set(["sequence", "core", "chain", "decision"]);

export function assertExecutionTree(tree, depth = 0) {
  if (depth > 12) throw new Error("execution tree exceeds depth 12");
  if (!tree || typeof tree !== "object" || Array.isArray(tree))
    throw new Error("execution node must be an object");
  if (!TYPES.has(tree.type))
    throw new Error(`unsupported execution node type: ${tree.type}`);
  if (tree.type === "sequence") {
    if (
      !Array.isArray(tree.children) ||
      tree.children.length < 1 ||
      tree.children.length > 32
    ) {
      throw new Error("sequence.children must contain 1 to 32 nodes");
    }
    tree.children.forEach((child) => assertExecutionTree(child, depth + 1));
  }
  if (tree.type === "decision") {
    if (!tree.selector || !tree.cases || typeof tree.cases !== "object")
      throw new Error("decision requires selector and cases");
    Object.values(tree.cases).forEach((child) =>
      assertExecutionTree(child, depth + 1),
    );
    if (tree.default) assertExecutionTree(tree.default, depth + 1);
  }
  return tree;
}
