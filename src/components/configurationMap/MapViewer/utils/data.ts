import { Graph } from "@antv/x6";
import { backgroundNodeShape, defaultZIndex } from "../config";
import { ComponentNodeType, ComponentType, MapType } from "../types";
import { createBackgroundZIndex, createNodeId, getBackgroundNode, isBackgroundNode } from ".";

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

/** 处理原始数据并替换资产组件的名称 */
export const foramtMapData = (data: MapType, assetsNameMap: Record<string, string>): ComponentNodeType[] => {
  const { container, components } = data;
  const componentNodes = OriginComponentsToComponentNodes(components.map(d => ({ ...d, asset: d.asset ? { ...d.asset, name: assetsNameMap[d.asset.id] ?? d.asset.name } : undefined })));
  const backgroundNodeZIndex = createBackgroundZIndex(componentNodes);
  const backgroundNode = createBackgroundNode({ width: container.width ?? 0, height: container.height ?? 0, zIndex: backgroundNodeZIndex });
  return [backgroundNode, ...componentNodes];
}

/** 将当前数据处理成最终产物 */
export const foramtToMapData = (graph: Graph): MapType => {
  const nodes = graph.getNodes();
  const backgroundNode = getBackgroundNode(graph);
  const backgroundSize = backgroundNode?.getSize();
  const componentNodes = nodes.filter(d => !isBackgroundNode(d));
  return {
    container: {
      width: backgroundSize?.width,
      height: backgroundSize?.height,
    },
    components: componentNodes.map(node => {
      const position = node.getPosition();
      const size = node.getSize();
      const data = node.getData();
      return {
        id: node.id,
        type: node.shape,
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
        zIndex: node.getZIndex(),
        angle: node.getAngle(),
        config: data.config,
        asset: data.asset,
      }
    }),
  };
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