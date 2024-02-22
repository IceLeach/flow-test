import { Cell, Graph, Node } from "@antv/x6";
import { max, min } from "lodash";
import { defaultBackgroundZIndex } from "../config";
import { ComponentNodeType } from "../types";
import { excludeReadonlyCells, getBackgroundNode, nodeIntersect } from ".";

/** 计算背景组件的zIndex */
export const createBackgroundZIndex = (componentNodes: ComponentNodeType[]): number => {
  const nodesZIndexList = componentNodes.map((componentNode) => componentNode.zIndex);
  const minNodeZIndex = min(nodesZIndexList);
  if (!minNodeZIndex) return defaultBackgroundZIndex;
  return minNodeZIndex - 1 < defaultBackgroundZIndex ? minNodeZIndex - 1 : defaultBackgroundZIndex;
}

/** 获取相交的节点 */
export const getOverlapNodes = (graph: Graph, cell: Cell): Node[] => {
  if (!cell.isNode()) return [];
  const checkedCells = excludeReadonlyCells(graph.getCells()).filter(d => d.id !== cell.id);
  return checkedCells.filter(currentCell => currentCell.isNode() && nodeIntersect(cell, currentCell)) as Node[];
}

/** 置前元素并返回是否进行了操作 */
export const frontCell = (graph: Graph, cell: Cell): boolean => {
  const cellZIndex = cell.getZIndex();
  const overlapCells = getOverlapNodes(graph, cell);
  const zIndexList = overlapCells.map((cell) => cell.getZIndex());
  const maxZIndex = max(zIndexList);
  if (typeof (maxZIndex) !== 'number' || typeof (cellZIndex) !== 'number' || cellZIndex > maxZIndex) {
    return false;
  }
  const newCellZIndex = maxZIndex + 1;
  cell.setZIndex(newCellZIndex);
  return true;
}

/** 置后元素并返回是否进行了操作 */
export const backCell = (graph: Graph, cell: Cell): boolean => {
  const cellZIndex = cell.getZIndex();
  const overlapCells = getOverlapNodes(graph, cell);
  const zIndexList = overlapCells.map((cell) => cell.getZIndex());
  const minZIndex = min(zIndexList);
  if (typeof (minZIndex) !== 'number' || typeof (cellZIndex) !== 'number' || cellZIndex < minZIndex) {
    return false;
  }
  const newCellZIndex = minZIndex - 1;
  const backgroundNode = getBackgroundNode(graph);
  const backgroundZIndex = backgroundNode?.getZIndex();
  if (typeof (backgroundZIndex) === 'number' && newCellZIndex <= backgroundZIndex) {
    backgroundNode?.setZIndex(newCellZIndex - 1);
  }
  cell.setZIndex(newCellZIndex);
  return true;
}
