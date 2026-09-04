import { assertExecutionTree } from "../contracts/orchestrator-contract.mjs";
import { runCore } from "../core/core-harness.mjs";
import { runChain } from "../chains/chain-harness.mjs";
import { createExecutionContext } from "../core/execution-context.mjs";
import { chooseBranch } from "./decision-router.mjs";

export async function runOrchestrator({
  tree,
  runtime,
  initial = {},
  seed = 73019,
} = {}) {
  assertExecutionTree(tree);
  const context = createExecutionContext({ seed, initial });
  const results = [];
  const started = performance.now();

  const execute = async (node) => {
    context.record("node_started", { id: node.id, nodeType: node.type });
    let result;
    if (node.type === "sequence") {
      const children = [];
      for (const child of node.children) {
        const childResult = await execute(child);
        children.push(childResult);
        if (childResult.status === "FAILED" || childResult.status === "STOP")
          break;
      }
      result = {
        id: node.id ?? "sequence",
        status: children.every((item) =>
          ["PASS", "ACCEPT"].includes(item.status),
        )
          ? "PASS"
          : children.some((item) => ["FAILED", "STOP"].includes(item.status))
            ? "FAILED"
            : "PARTIAL",
        children,
        callCount: children.reduce(
          (sum, item) => sum + (item.callCount ?? 0),
          0,
        ),
      };
    } else if (node.type === "core") {
      result = await runCore({
        request: {
          ...node.request,
          context: { ...context.values, ...(node.request?.context ?? {}) },
        },
        runtime,
      });
      if (result.status !== "STOP" && node.outputKey)
        context.values[node.outputKey] = structuredClone(result.value);
    } else if (node.type === "chain") {
      result = await runChain({
        chain: {
          ...node.chain,
          initial: { ...context.values, ...(node.chain?.initial ?? {}) },
        },
        runtime,
      });
      if (result.status !== "FAILED" && node.outputKey)
        context.values[node.outputKey] = structuredClone(result.context);
    } else {
      const branch = chooseBranch(node, context.values);
      context.record("branch_selected", {
        id: node.id,
        selector: node.selector,
        value: branch.value,
      });
      result = await execute(branch.selected);
    }
    results.push({
      id: node.id ?? node.type,
      type: node.type,
      status: result.status,
      callCount: result.callCount ?? 0,
    });
    context.record("node_completed", { id: node.id, status: result.status });
    return result;
  };

  const root = await execute(tree);
  return {
    status: ["PASS", "ACCEPT"].includes(root.status)
      ? "PASS"
      : root.status === "FAILED" || root.status === "STOP"
        ? "FAILED"
        : "PARTIAL",
    seed: context.seed,
    context: structuredClone(context.values),
    root,
    results,
    trace: context.trace,
    callCount: root.callCount ?? 0,
    durationMilliseconds: Math.round(performance.now() - started),
  };
}
