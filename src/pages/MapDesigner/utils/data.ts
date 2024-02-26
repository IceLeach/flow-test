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

/** 解析元素数据 */
export const jsonToMapData = (json: string | null): MapType => {
  const jsonData = json ? JSON.parse(json) : { data: { type: 'room', width: 1200, height: 600, }, components: [] };
  const { data, components } = jsonData;
  return {
    container: {
      width: data.width,
      height: data.height,
    },
    components: components.map((d: any) => {
      const componentData = d.data ?? {};
      const { isAsset, id, name, ...restData } = componentData;
      return {
        id: d.id,
        type: d.name,
        x: d.x,
        y: d.y,
        width: d.width,
        height: d.height,
        zIndex: d.zIndex,
        angle: d.data?.rotate,
        config: restData,
        asset: isAsset ? { id, name } : undefined,
      }
    }),
  };
}

/** 转换成储存格式 */
export const mapDataToJson = (mapData: MapType): string => {
  const { container, components } = mapData;
  const jsonData = {
    data: {
      type: 'room',
      width: container.width,
      height: container.height,
    },
    components: components.map(d => ({
      id: d.id,
      name: d.type,
      renderKey: d.type,
      x: d.x,
      y: d.y,
      width: d.width,
      height: d.height,
      zIndex: d.zIndex,
      data: {
        ...d.config,
        ...!!d.asset ? {
          isAsset: true,
          id: d.asset?.id,
          name: d.asset?.name,
        } : {},
      },
    })),
  };
  return JSON.stringify(jsonData);
}

/** 处理原始数据并替换资产组件的名称 */
export const foramtMapData = (data: MapType, assetsNameMap: Record<string, string>): ComponentNodeType[] => {
  const { container, components } = data;
  const componentNodes = OriginComponentsToComponentNodes(components.filter(d => !d.asset || !!assetsNameMap[d.asset.id]).map(d => ({ ...d, asset: d.asset ? { ...d.asset, name: assetsNameMap[d.asset.id] ?? d.asset.name } : undefined })));
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
