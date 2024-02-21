import { Graph } from "@antv/x6";
import { backgroundNodeShape, defaultZIndex } from "../config";
import { ComponentNodeType, ComponentType, MapType } from "../types";
import { createBackgroundZIndex, createNodeId } from ".";

/** 处理原始数据 将原始组件转换为组件节点 */
export const OriginComponentsToComponentNodes = (components: ComponentType[]): ComponentNodeType[] => {
  return components.map((component) => ({
    id: component.id ?? createNodeId(),
    shape: component.type,
    size: {
      width: component.width,
      height: component.height,
    },
    position: {
      x: component.x,
      y: component.y,
    },
    zIndex: component.zIndex ?? defaultZIndex,
    angle: component.angle,
    data: {
      config: component.config,
      asset: component.asset,
    },
  }));
}

/** 生成背景组件 */
export const createBackgroundNode = (data: { width: number; height: number; zIndex: number }): ComponentNodeType => {
  const { width, height, zIndex } = data;
  return {
    id: createNodeId(),
    shape: backgroundNodeShape,
    size: {
      width,
      height,
    },
    position: {
      x: 0,
      y: 0,
    },
    zIndex: zIndex,
    data: {
      config: {},
    },
  }
}

/** 处理原始数据 */
export const foramtMapData = (data: MapType): ComponentNodeType[] => {
  const { container, components } = data;
  const componentNodes = OriginComponentsToComponentNodes(components);
  const backgroundNodeZIndex = createBackgroundZIndex(componentNodes);
  const backgroundNode = createBackgroundNode({ width: container.width ?? 0, height: container.height ?? 0, zIndex: backgroundNodeZIndex });
  return [backgroundNode, ...componentNodes];
}

/** 加载数据 */
export const loadData = (graph: Graph, data: ComponentNodeType[]) => {
  graph.fromJSON(data);
  graph.zoomToFit();
  graph.zoom(-0.05);
}

/** 获取当前数据 */
export const getGraphData = (graph: Graph): ComponentNodeType[] => {
  const data = graph.toJSON().cells;
  return data.map(d => ({
    id: d.id!,
    shape: d.shape!,
    size: d.size,
    position: d.position,
    zIndex: d.zIndex!,
    angle: d.angle,
    data: d.data,
  }));
}
