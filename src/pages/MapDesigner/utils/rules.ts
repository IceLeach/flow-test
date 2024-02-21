import { Graph, Node } from "@antv/x6";
import { shapeCrossBackground, shapeOverlappable } from "../register";
import { getBackgroundNode, getOverlapNodes, nodeContains } from ".";

/** 判断组件节点是否不完全在背景节点内 */
export const isNotInBackgroundNode = (graph: Graph, node: Node): boolean => {
  const backgroundNode = getBackgroundNode(graph);
  if (!backgroundNode) return false;
  const isContains = nodeContains(backgroundNode, node);
  return !isContains;
}

/** 判断组件节点是否违反越界规则 */
export const isOutOfBounds = (graph: Graph, node: Node): boolean => {
  const shape = node.shape;
  const canCrossBackground = shapeCrossBackground(shape);
  if (canCrossBackground) return false;
  return isNotInBackgroundNode(graph, node);
}

/** 判断组件节点是否违反重叠规则 */
export const isBreachOfOverlapRule = (graph: Graph, node: Node): boolean => {
  const shape = node.shape;
  const overlappable = shapeOverlappable(shape);
  if (overlappable) return false;
  const overlapNodes = getOverlapNodes(graph, node);
  const checkedOverlapNodes = overlapNodes.filter(d => {
    const itemShape = d.shape;
    const itemOverlappable = shapeOverlappable(itemShape);
    return !itemOverlappable;
  });
  return checkedOverlapNodes.length !== 0;
}

/** 判断组件节点是否违反了规则 在修改组件位置和尺寸时使用 */
export const isBreachOfRules = (graph: Graph, node: Node): boolean => {
  const outOfBounds = isOutOfBounds(graph, node);
  if (outOfBounds) return true;
  const violatedOverlapRule = isBreachOfOverlapRule(graph, node);
  if (violatedOverlapRule) return true;
  return false;
}
