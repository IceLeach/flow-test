import { Cell, Graph, Node } from "@antv/x6";
import { shapeIsReadonly } from "../register";
import { backgroundNodeShape } from "../config";
import { ComponentAssetType, ComponentConfigType, ComponentNodeType } from "../types";
import { createNodeId } from ".";

type CreateNodeOptions = {
  shape: string;
  x?: number;
  y?: number;
  width: number;
  height: number;
  zIndex?: number;
  config?: ComponentConfigType;
  asset?: ComponentAssetType;
};

type CreateDragNodeOptions = Omit<CreateNodeOptions, 'x' | 'y'>;

/** 创建拖拽节点 */
export const createDragNode = (graph: Graph, options: CreateDragNodeOptions): Node => {
  const { config, asset, ...restOptions } = options;
  return graph.createNode({
    ...restOptions,
    id: createNodeId(),
    data: { config, asset },
  });
}

/** 获取节点数据 */
export const getNodeData = (node: Node): ComponentNodeType => {
  return {
    id: node.id,
    shape: node.shape,
    size: node.getSize(),
    position: node.getPosition(),
    zIndex: node.getZIndex()!,
    angle: node.getAngle(),
    data: node.getData(),
  };
}

/** 打印元素信息 开发调试时使用 */
export const cellDataLog = (cells: Cell | Cell[], prefix?: string) => {
  const getCellData = (cell: Cell) => {
    const isNode = cell.isNode();
    return {
      id: cell.id,
      shape: cell.shape,
      size: isNode ? cell.getSize() : null,
      position: isNode ? cell.getPosition() : null,
      zIndex: cell.getZIndex(),
      angle: isNode ? cell.getAngle() : null,
      data: cell.getData(),
    };
  }
  const data = Array.isArray(cells) ? cells.map(cell => getCellData(cell)) : [getCellData(cells)];
  const logData = data.length === 0 ? null : data.length === 1 ? data[0] : data;
  if (prefix) {
    console.log(prefix, logData);
  } else {
    console.log(logData);
  }
}

/** 判断是否为只读元素 */
export const isReadonlyCell = (cell: Cell): boolean => {
  const shape = cell.shape;
  return shapeIsReadonly(shape);
}

/** 排除只读元素 */
export const excludeReadonlyCells = (cells: Cell[]): Cell[] => {
  return cells.filter(cell => !isReadonlyCell(cell));
}

/** 判断是否是背景组件节点 */
export const isBackgroundNode = (cell: Cell) => {
  return cell.shape === backgroundNodeShape;
}

/** 获取背景组件节点 */
export const getBackgroundNode = (graph: Graph): Node | undefined => {
  return graph.getNodes().find(node => isBackgroundNode(node));
}

/** 设置组件业务属性 */
export const setCellConfig = <T extends ComponentConfigType = ComponentConfigType>(cell: Cell, config: T) => {
  const data = cell.getData();
  const newData = { ...data, config };
  cell.setData(newData);
}

/** 判断是否为资产节点 */
export const isAssetNode = (node: Node): boolean => {
  const data = node.getData();
  return !!data.asset;
}
