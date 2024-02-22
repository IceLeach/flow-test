import React, { useEffect, useRef, useState } from 'react';
import { CellView, Graph, Node } from '@antv/x6';
import { createGraph } from './graphConfig';
import { registerNode } from './register';
import { cellDataLog, foramtMapData, getAssetNodes, getBackgroundNode, loadData } from './utils';
import { testData, testData2 } from '@/pages/MapDesigner/testData';
import styles from './index.less';

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

type MapViewerProps = {
  roomId: number;
  /** 加载状态改变时 */
  onStatusChange: (status: 'loading' | 'finished' | 'error') => void;
  /** 高亮的资产 */
  highlightAsset?: string;
  /** 获取机房下资产的名称 */
  getRoomAssetsName: (roomId: number) => Record<string, string>;
}

const getData = async (data: { roomId: number }) => {
  return {
    roomId: data.roomId,
    data: data.roomId === 1 ? testData : testData2,
  }
}

const MapViewer: React.FC<MapViewerProps> = (props) => {
  const { roomId, onStatusChange, highlightAsset, getRoomAssetsName } = props;
  const [graph, setGraph] = useState<Graph>();
  // 背景节点
  const [backgroundNode, setBackgroundNode] = useState<Node>();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  // 避免闭包时使用
  const backgroundNodeRef = useRef<Node>();
  const highlightCellViewRef = useRef<CellView>();

  graphRef.current = graph;
  backgroundNodeRef.current = backgroundNode;

  useEffect(() => {
    onStatusChange('loading');
    const igraph = createGraph({
      graph: { container: containerRef.current! },
    });
    setGraph(igraph);
    // 注册组件
    registerNode();
    // 事件绑定
    igraph.on('node:click', (data) => {
      const { node } = data;
      cellDataLog(node, 'click');
    });
    // 加载数据
    getData({ roomId }).then(res => {
      const graphData = foramtMapData(res.data, getRoomAssetsName(roomId));
      loadData(igraph, graphData);
      setBackgroundNode(getBackgroundNode(igraph));
    }).catch(() => {
      onStatusChange('error');
    });

    return () => {
      setGraph(undefined);
      setBackgroundNode(undefined);
      highlightCellViewRef.current = undefined;
    };
  }, [roomId]);

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
