import { Graph, Node } from "@antv/x6";
import { backgroundNodeShape, defaultZIndex } from "../config";
import { ComponentNodeType, ComponentType, HeatMapModeData, MapType } from "../types";
import { ViewerMode } from "..";
import { createBackgroundZIndex, createNodeId, getAssetNodes, getBackgroundNode, isBackgroundNode, setCellConfig } from ".";

/** 处理原始数据 将原始组件转换为组件节点 */
export const OriginComponentsToComponentNodes = (components: ComponentType[], mode?: ViewerMode): ComponentNodeType[] => {
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
      env: {
        type: mode?.type ?? 'default',
        status: component.asset && mode?.type === 'plan' ? mode.data[component.asset.id] : undefined,
      },
    },
  }));
}

/** 生成背景组件 */
export const createBackgroundNode = (data: { width: number; height: number; zIndex: number }, mode?: ViewerMode): ComponentNodeType => {
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
      env: {
        type: mode?.type ?? 'default',
      },
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

/** 创建热力图节点 */
const createHeatmapNode = (graph: Graph, data: HeatMapModeData): Node => {
  const backgroundNode = getBackgroundNode(graph);
  const size = backgroundNode?.getSize();
  return graph.createNode({
    id: createNodeId(),
    shape: 'heatmap',
    size: {
      width: size?.width ?? 0,
      height: size?.height ?? 0,
    },
    position: {
      x: 0,
      y: 0,
    },
    zIndex: 9999,
    data: { config: data },
  });
}

/** 更新热力图 data为false时删除热力图 */
const updateHeatmap = (graph: Graph, data: HeatMapModeData | false) => {
  const heatMapNode = graph.getNodes().find(node => node.shape === 'heatmap');
  if (!data) {
    if (heatMapNode) {
      graph.removeNode(heatMapNode);
    }
    return;
  }
  if (!heatMapNode) {
    createHeatmapNode(graph, data);
  } else {
    setCellConfig(heatMapNode, data);
  }
}

/** 更新节点展示模式 */
export const updateNodeEnv = (graph: Graph, mode?: ViewerMode) => {
  const assetNodes = getAssetNodes(graph);
  if (!mode) {
    updateHeatmap(graph, false);
    assetNodes.forEach(node => {
      const data = node.getData();
      node.setData({ ...data, env: { type: 'default' } });
    });
  } else if (mode.type === 'plan') {
    updateHeatmap(graph, false);
    const modeData = mode.data;
    assetNodes.forEach(node => {
      const data = node.getData();
      const { asset } = data;
      node.setData({ ...data, env: { type: 'plan', status: modeData[asset.id] } });
    });
  } else if (mode.type === 'heatMap') {
    updateHeatmap(graph, mode.data);
    assetNodes.forEach(node => {
      const data = node.getData();
      node.setData({ ...data, env: { type: 'heatMap' } });
    });
  }
}
