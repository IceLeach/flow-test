import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CellView, Graph, Node } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { isEqual } from 'lodash';
import { cmdbBizRoomConfigurationFindGet, cmdbBizRoomConfigurationGetWaitGet } from '@/services';
import { Store } from './utils/store';
import { defaultZIndex } from './config';
import { createGraph } from './graphConfig';
import { getShapeZIndex, registerNode } from './register';
import DndPanel, { DndAssetType } from './DndPanel';
import ToolbarPanel from './ToolbarPanel';
import FormPanel, { FormPanelActions } from './FormPanel';
import KeyboardPanel from './KeyboardPanel';
import { cellDataLog, createComponentNode, foramtMapData, foramtToMapData, getAssetNodes, getBackgroundNode, getGraphData, isBreachOfRules, jsonToMapData, loadData, mapDataToJson, updateComponentNode } from './utils';
import { ComponentNodeType, HistoryType } from './types';
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

type MapDesignerProps = {
  roomId: number;
  /** 拖拽栏的挂载点 */
  dndPanelContainerRef: React.RefObject<HTMLElement>;
  /** 加载状态改变时 */
  onStatusChange: (status: 'loading' | 'finished' | 'error') => void;
  /** 高亮的资产 */
  highlightAsset?: string;
  /** 获取机房下资产的名称 */
  getRoomAssetsName: (roomId: number) => Record<string, string>;
  /** 触发保存时 */
  onSave: (data: SaveOptions) => void;
}

export type SaveCheck = {
  add?: Node[];
  change?: Node[];
  remove?: Node[];
}

const MapDesigner: React.FC<MapDesignerProps> = (props) => {
  const { roomId, dndPanelContainerRef, onStatusChange, highlightAsset, getRoomAssetsName, onSave } = props;
  const [graph, setGraph] = useState<Graph>();
  // 选中的节点
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  // 背景节点
  const [backgroundNode, setBackgroundNode] = useState<Node>();
  // 历史操作
  const [history, setHistory] = useState<HistoryType>();
  // 待部署设备
  const [dndAssets, setDndAssets] = useState<DndAssetType[]>([]);
  const [readyRoomId, setReadyRoomId] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  const dndRef = useRef<Dnd>();
  const storeRef = useRef<Store>();
  const formPanelActionsRef = useRef<FormPanelActions>();
  // 避免闭包时使用
  const selectedNodesRef = useRef<Node[]>([]);
  // 避免闭包时使用
  const backgroundNodeRef = useRef<Node>();
  const highlightCellViewRef = useRef<CellView>();

  graphRef.current = graph;
  selectedNodesRef.current = selectedNodes;
  backgroundNodeRef.current = backgroundNode;

  /** 刷新待部署设备 数据重新加载时使用 */
  const reloadDndAssets = () => {
    const store = storeRef.current;
    if (!store) return;
    const value = store.getValue();
    if (!value) return;
    setDndAssets(c => c.map(d => ({ ...d, used: !!value.find(item => item.data.asset?.id === d.id) })));
  }

  /** 刷新节点数据 数据重新加载时使用 */
  const reloadNodes = () => {
    const graph = graphRef.current;
    if (!graph) return;
    const newselectedNodes = selectedNodesRef.current.map(node => {
      const nodeId = node.id;
      return graph.getCellById(nodeId) as Node;
    }).filter(node => !!node);
    // console.log('newselectedNodes', newselectedNodes)
    const newBackgroundNode = backgroundNodeRef.current ? graph.getCellById(backgroundNodeRef.current.id) as Node : undefined;
    setSelectedNodes(newselectedNodes);
    setBackgroundNode(newBackgroundNode);
    graph.cleanSelection();
    graph.select(newselectedNodes);
    graph.clearTransformWidgets();
    newselectedNodes.forEach(node => {
      graph.createTransformWidget(node);
    });
  }

  /** 读取并重新加载当前数据 */
  const resetGraphDataFromHistory = () => {
    const store = storeRef.current;
    const graph = graphRef.current;
    if (!store || !graph) return;
    const value = store.getValue();
    if (!value) return;
    const diff = getGraphData(graph);
    if (diff) {
      const valueStatus: Record<string, boolean> = {};
      value.forEach(d => {
        valueStatus[d.id] = false;
      });
      const updateItems: ComponentNodeType[] = [];
      const deleteItems: ComponentNodeType[] = [];
      diff.forEach(item => {
        const currentItem = value.find(d => d.id === item.id);
        if (!currentItem) {
          deleteItems.push(item);
        } else {
          if (!isEqual(item, currentItem)) {
            updateItems.push(currentItem);
          }
          valueStatus[item.id] = true;
        }
      });
      const newItems: ComponentNodeType[] = value.filter(d => !valueStatus[d.id]);
      graph.removeCells(deleteItems.map(d => graph.getCellById(d.id)));
      newItems.forEach(d => createComponentNode(graph, d));
      updateItems.forEach(d => updateComponentNode(graph.getCellById(d.id) as Node, d));
    } else {
      graph.fromJSON(value);
    }
    reloadDndAssets();
    reloadNodes();
  }

  /** 刷新历史数据 在变更历史后使用 */
  const updateHistoryData = () => {
    const store = storeRef.current;
    const graph = graphRef.current;
    if (!store || !graph) return;
    // console.log('data', store.getValue())
    setHistory({
      undo: () => {
        store.undo();
        resetGraphDataFromHistory();
        updateHistoryData();
      },
      redo: () => {
        store.redo();
        resetGraphDataFromHistory();
        updateHistoryData();
      },
      canUndo: store.canUndo(),
      canRedo: store.canRedo(),
    });
  }

  /** 保存当前数据 */
  const saveCurrentData = () => {
    const store = storeRef.current;
    const graph = graphRef.current;
    if (!store || !graph) return;
    const currentData = getGraphData(graph);
    store.setValue(currentData);
    updateHistoryData();
  }

  /** 尝试保存数据 修改位置和尺寸时需要进行检查 在违反规则时会撤销当前操作 */
  const trySaveData = (saveCheck?: SaveCheck) => {
    const graph = graphRef.current;
    if (!graph) return;
    if (!saveCheck) {
      saveCurrentData();
      return;
    }
    const { add, change, remove } = saveCheck;
    const ruleNodeList = [...add ?? [], ...change ?? []];
    const breachOfRulesList = ruleNodeList.map(d => isBreachOfRules(graph, d));
    if (breachOfRulesList.includes(true)) {
      resetGraphDataFromHistory();
    } else {
      saveCurrentData();
      if (add) {
        const addAssets = add.filter(d => !!d.getData().asset);
        if (addAssets.length) {
          setDndAssets(c => c.map(d => {
            const assetInAdd = addAssets.find(item => item.getData().asset.id === d.id);
            return { ...d, used: assetInAdd ? true : d.used };
          }));
        }
      }
      if (remove) {
        const removeAssets = remove.filter(d => !!d.getData().asset);
        if (removeAssets.length) {
          setDndAssets(c => c.map(d => {
            const assetInRemove = removeAssets.find(item => item.getData().asset.id === d.id);
            return { ...d, used: assetInRemove ? false : d.used };
          }));
        }
      }
    }
  }

  useEffect(() => {
    onStatusChange('loading');
    const igraph = graphRef.current ?? createGraph({
      graph: { container: containerRef.current! },
    });
    setGraph(igraph);
    // 注册组件
    registerNode();
    // 事件绑定
    igraph.on('node:added', data => {
      const { node } = data;
      cellDataLog(node, 'add');
      node.setZIndex(getShapeZIndex(node.shape) ?? defaultZIndex);
      // igraph.findViewByCell(node)?.highlight();
      trySaveData({ add: [node] });
    });
    igraph.on('node:removed', data => {
      const { node } = data;
      cellDataLog(node, 'remove');
    });
    igraph.on('node:moved', data => {
      const { node } = data;
      cellDataLog(node, 'moved');
      trySaveData({ change: [node] });
    });
    igraph.on('node:resized', data => {
      const { node } = data;
      cellDataLog(node, 'resized');
      trySaveData({ change: [node] });
    });
    igraph.on('node:rotated', data => {
      const { node } = data;
      cellDataLog(node, 'rotated');
      trySaveData({ change: [node] });
    });
    igraph.on('selection:changed', data => {
      const { selected } = data;
      cellDataLog(selected, 'selection');
      setSelectedNodes(selected.filter(d => d.isNode()) as Node[]);
    });
    // dnd面板
    dndRef.current = new Dnd({
      target: igraph,
      getDragNode: (node) => node.clone({ keepId: true }),
      getDropNode: (node) => node.clone({ keepId: true }),
    });
    // 历史记录
    const store = new Store();
    storeRef.current = store;
    // 加载数据
    cmdbBizRoomConfigurationFindGet({ roomId: `${roomId}` }).then(res => {
      const graphData = foramtMapData(jsonToMapData(res.data), getRoomAssetsName(roomId));
      loadData(igraph, graphData);
      store.reset(graphData);
      updateHistoryData();
      setBackgroundNode(getBackgroundNode(igraph));
      setReadyRoomId(roomId);
      cmdbBizRoomConfigurationGetWaitGet({ roomId: `${roomId}` }).then(res => {
        const loadedAssets: DndAssetType[] = graphData.filter(d => !!d.data.asset).map(d => ({ id: d.data.asset!.id, name: d.data.asset!.name, type: d.shape, used: true }));
        const waitAssets: DndAssetType[] = res.data.map(d => ({ id: `${d.id}_${d.type}`, name: d.name, type: d.icon, used: false }));
        setDndAssets([...loadedAssets, ...waitAssets]);
        onStatusChange('finished');
      }).catch(() => {
        onStatusChange('error');
      });
    }).catch(() => {
      onStatusChange('error');
    });

    return () => {
      setSelectedNodes([]);
      setBackgroundNode(undefined);
      setHistory(undefined);
      setDndAssets([]);
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
  }, [highlightAsset, graph, readyRoomId]);

  const saveToServer = () => {
    if (!graph) return;
    const mapData = foramtToMapData(graph);
    const assetNodes = getAssetNodes(graph);
    onSave({
      roomId,
      data: mapDataToJson(mapData),
      assets: dndAssets.map(d => {
        if (d.used) {
          const assetNode = assetNodes.find(item => item.getData().asset.id === d.id)!;
          const { x, y } = assetNode.getPosition();
          return { ...d, used: true, x, y };
        } else {
          return { ...d, used: false, x: undefined, y: undefined };
        }
      }),
    });
  }

  return (
    <div className={styles.page}>
      {dndPanelContainerRef?.current && createPortal(
        <DndPanel graph={graph} dndRef={dndRef} dndAssets={dndAssets} />,
        dndPanelContainerRef.current,
      )}
      <div className={styles.center}>
        <div className={styles.top}>
          <ToolbarPanel
            graph={graph}
            selectedNodes={selectedNodes}
            history={history}
            saveData={trySaveData}
            saveToServer={saveToServer}
          />
        </div>
        <div className={styles.container}>
          <div ref={containerRef} className={styles.graphContainer}></div>
        </div>
      </div>
      <div className={styles.right}>
        <FormPanel
          graph={graph}
          backgroundNode={backgroundNode}
          selectedNodes={selectedNodes}
          saveData={trySaveData}
          actionsRef={formPanelActionsRef}
        />
      </div>
      <KeyboardPanel
        graph={graph}
        selectedNodes={selectedNodes}
        history={history}
        saveData={trySaveData}
      />
    </div>
  );
}

export default MapDesigner;
