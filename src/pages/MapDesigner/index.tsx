import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Graph, Node } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Store } from './utils/store';
import { defaultZIndex } from './config';
import { createGraph } from './graphConfig';
import { getShapeZIndex, registerNode } from './register';
import DndPanel, { DndAssetType } from './DndPanel';
import ToolbarPanel from './ToolbarPanel';
import FormPanel, { FormPanelActions } from './FormPanel';
import KeyboardPanel from './KeyboardPanel';
import { cellDataLog, foramtMapData, getBackgroundNode, getGraphData, isBreachOfRules, loadData } from './utils';
import { HistoryType } from './types';
import { testData } from './testData';
import styles from './index.less';

type MapDesignerProps = {
  roomId: number;
  /** 拖拽栏的挂载点 */
  dndPanelContainerRef: React.RefObject<HTMLElement>;
  /** 加载状态改变时 */
  onStatusChange: (status: 'loading' | 'finished' | 'error') => void;
}

export type SaveCheck = {
  add?: Node[];
  change?: Node[];
  remove?: Node[];
}

const getData = async (data: { roomId: number }) => {
  return {
    roomId: data.roomId,
    data: testData,
  }
}
const getAsset = async (data: { roomId: number }) => {
  return {
    roomId: data.roomId,
    data: [
      { id: 1, name: '设备1', icon: 'IT', type: '1' },
      { id: 2, name: '设备2', icon: 'AC', type: '1' },
    ],
  }
}

const MapDesigner: React.FC<MapDesignerProps> = (props) => {
  const { roomId, dndPanelContainerRef, onStatusChange } = props;
  const [graph, setGraph] = useState<Graph>();
  // 选中的节点
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  // 背景节点
  const [backgroundNode, setBackgroundNode] = useState<Node>();
  // 历史操作
  const [history, setHistory] = useState<HistoryType>();
  // 待部署设备
  const [dndAssets, setDndAssets] = useState<DndAssetType[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  const dndRef = useRef<Dnd>();
  const storeRef = useRef<Store>();
  const formPanelActionsRef = useRef<FormPanelActions>();
  // 避免闭包时使用
  const selectedNodesRef = useRef<Node[]>([]);
  // 避免闭包时使用
  const backgroundNodeRef = useRef<Node>();

  graphRef.current = graph;
  selectedNodesRef.current = selectedNodes;
  backgroundNodeRef.current = backgroundNode;

  /** 重置状态 每次初始化时使用 */
  const beforeInit = () => {
    setSelectedNodes([]);
    setBackgroundNode(undefined);
    setHistory(undefined);
    setDndAssets([]);
  }

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
    graph.fromJSON(value);
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
    beforeInit();
    const igraph = createGraph({
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
    getData({ roomId }).then(res => {
      const graphData = foramtMapData(res.data);
      loadData(igraph, graphData);
      store.reset(graphData);
      updateHistoryData();
      setBackgroundNode(getBackgroundNode(igraph));
      getAsset({ roomId }).then(res => {
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

    return () => igraph.dispose();
  }, [roomId]);

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