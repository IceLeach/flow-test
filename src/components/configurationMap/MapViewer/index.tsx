import React, { useEffect, useRef, useState } from 'react';
import { CellView, Graph, Node } from '@antv/x6';
import { createGraph } from './graphConfig';
import { registerNode } from './register';
import { foramtMapData, getAssetNodes, getBackgroundNode, isAssetNode, jsonToMapData, loadData, updateNodeEnv } from './utils';
import { HeatMapModeData, PlanModeItemStatus } from './types';
import styles from './index.less';
import { cmdbBizRoomConfigurationFindGet, cmdbBizScreenConfigurationListGet } from '@/services';

type SaveAssetType = {
  id: string;
  name: string;
  type: string;
  used: true;
  x: number;
  y: number;
} | {
  id: string;
  name: string;
  type: string;
  used: false;
  x: undefined;
  y: undefined;
}

export type SaveOptions = {
  roomId: number;
  data: string;
  assets: SaveAssetType[];
}

export type ViewerMode = {
  type: 'plan';
  data: Record<string, PlanModeItemStatus>;
} | {
  type: 'heatMap';
  data: HeatMapModeData;
}

type MapViewerProps = {
  roomId: number;
  /** 加载状态改变时 */
  onStatusChange: (status: 'loading' | 'finished' | 'error') => void;
  /** 高亮的资产 */
  highlightAsset?: string;
  mode?: ViewerMode;
  onAssetNodeMouseEnter?: (asset: { id: string, name: string }, e: MouseEvent) => void;
  onAssetNodeMouseLeave?: (asset: { id: string, name: string }, e: MouseEvent) => void;
  onAssetNodeClick?: (asset: { id: string, name: string }, e: MouseEvent) => void;
  onAssetNodeDoubleClick?: (asset: { id: string, name: string }, e: MouseEvent) => void;
}

const MapViewer: React.FC<MapViewerProps> = (props) => {
  const { roomId, onStatusChange, highlightAsset, mode, onAssetNodeMouseEnter, onAssetNodeMouseLeave, onAssetNodeClick, onAssetNodeDoubleClick } = props;
  const [graph, setGraph] = useState<Graph>();
  // 背景节点
  const [backgroundNode, setBackgroundNode] = useState<Node>();
  const [readyRoomId, setReadyRoomId] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  // 避免闭包时使用
  const backgroundNodeRef = useRef<Node>();
  const highlightCellViewRef = useRef<CellView>();

  graphRef.current = graph;
  backgroundNodeRef.current = backgroundNode;

  useEffect(() => {
    onStatusChange('loading');
    const igraph = graphRef.current ?? createGraph({
      graph: { container: containerRef.current! },
    });
    setGraph(igraph);
    // 注册组件
    registerNode();
    // 事件绑定
    igraph.on('node:mouseenter', (data) => {
      const { node, e } = data;
      // cellDataLog(node, 'mouseenter');
      if (isAssetNode(node) && onAssetNodeMouseEnter) {
        onAssetNodeMouseEnter(node.getData().asset, e.originalEvent);
      }
    });
    igraph.on('node:mouseleave', (data) => {
      const { node, e } = data;
      if (isAssetNode(node) && onAssetNodeMouseLeave) {
        onAssetNodeMouseLeave(node.getData().asset, e.originalEvent);
      }
    });
    igraph.on('node:click', (data) => {
      const { node, e } = data;
      if (isAssetNode(node) && onAssetNodeClick) {
        onAssetNodeClick(node.getData().asset, e.originalEvent);
      }
    });
    igraph.on('node:dblclick', (data) => {
      const { node, e } = data;
      if (isAssetNode(node) && onAssetNodeDoubleClick) {
        onAssetNodeDoubleClick(node.getData().asset, e.originalEvent);
      }
    });
    // 加载数据
    Promise.all([cmdbBizRoomConfigurationFindGet({ roomId: `${roomId}` }), cmdbBizScreenConfigurationListGet({ roomId: `${roomId}` })]).then(([dataRes, nameRes]) => {
      const nameMap: Record<string, string> = {};
      nameRes.data.forEach((d) => {
        nameMap[`${d.id}_${d.type}`] = d.name;
      });
      const graphData = foramtMapData(jsonToMapData(dataRes.data), nameMap);
      loadData(igraph, graphData);
      setBackgroundNode(getBackgroundNode(igraph));
      setReadyRoomId(roomId);
      onStatusChange('finished');
    }).catch(() => {
      onStatusChange('error');
    });

    return () => {
      setBackgroundNode(undefined);
      highlightCellViewRef.current = undefined;
    };
  }, [roomId]);

  useEffect(() => {
    if (graph) {
      updateNodeEnv(graph, mode);
    }
  }, [graph, readyRoomId, mode]);

  useEffect(() => {
    if (graph) {
      const assetNodes = getAssetNodes(graph);
      const highlightNode = assetNodes.find(d => d.getData().asset.id === highlightAsset);
      highlightCellViewRef.current?.unhighlight();
      highlightCellViewRef.current = undefined;
      const newHighlightCellView = highlightNode ? graph.findViewByCell(highlightNode) : null;
      if (newHighlightCellView) {
        newHighlightCellView.highlight();
        highlightCellViewRef.current = newHighlightCellView;
      }
    }
  }, [highlightAsset, graph]);

  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <div className={styles.container}>
          <div ref={containerRef} className={styles.graphContainer}></div>
        </div>
      </div>
    </div>
  );
}

export default MapViewer;
