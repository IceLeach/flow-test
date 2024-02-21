/**
 * 快捷键绑定
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Graph, Node } from '@antv/x6';
import { excludeReadonlyCells } from '../utils';
import { HistoryType } from '../types';
import { SaveCheck } from '..';

type KeyboardPanelProps = {
  graph: Graph | undefined;
  selectedNodes?: Node[];
  history?: HistoryType;
  saveData: (saveCheck?: SaveCheck) => void;
}

type KeyBindType = {
  keys: string | string[];
  callback: () => void;
}

const KeyboardPanel: React.FC<KeyboardPanelProps> = (props) => {
  const { graph, selectedNodes, history, saveData } = props;
  const historyRef = useRef<HistoryType>();
  const checkedSelectedNodesRef = useRef<Node[]>([]);

  const checkedSelectedNodes = useMemo(() => {
    return excludeReadonlyCells(selectedNodes ?? []) as Node[];
  }, [selectedNodes]);

  historyRef.current = history;
  checkedSelectedNodesRef.current = checkedSelectedNodes;

  /** 快捷键设置 */
  const getBindItems = (graph: Graph): KeyBindType[] => {
    return [
      {
        keys: ['backspace', 'delete'],
        callback: () => {
          const checkedSelectedNodes = checkedSelectedNodesRef.current;
          graph.removeCells(checkedSelectedNodes);
          saveData({ remove: checkedSelectedNodes });
        }
      },
      {
        keys: ['ctrl+z', 'meta+z'],
        callback: () => {
          if (historyRef.current?.canUndo) {
            historyRef.current.undo();
          }
        }
      },
      {
        keys: ['ctrl+y', 'meta+y'],
        callback: () => {
          if (historyRef.current?.canRedo) {
            historyRef.current.redo();
          }
        }
      },
      {
        keys: 'up',
        callback: () => {
          const checkedSelectedNodes = checkedSelectedNodesRef.current;
          checkedSelectedNodes.forEach(node => {
            const position = node.getPosition();
            node.setPosition({ ...position, y: position.y - 1 });
          });
          saveData({ change: checkedSelectedNodes });
        }
      },
      {
        keys: 'down',
        callback: () => {
          const checkedSelectedNodes = checkedSelectedNodesRef.current;
          checkedSelectedNodes.forEach(node => {
            const position = node.getPosition();
            node.setPosition({ ...position, y: position.y + 1 });
          });
          saveData({ change: checkedSelectedNodes });
        }
      },
      {
        keys: 'left',
        callback: () => {
          const checkedSelectedNodes = checkedSelectedNodesRef.current;
          checkedSelectedNodes.forEach(node => {
            const position = node.getPosition();
            node.setPosition({ ...position, x: position.x - 1 });
          });
          saveData({ change: checkedSelectedNodes });
        }
      },
      {
        keys: 'right',
        callback: () => {
          const checkedSelectedNodes = checkedSelectedNodesRef.current;
          checkedSelectedNodes.forEach(node => {
            const position = node.getPosition();
            node.setPosition({ ...position, x: position.x + 1 });
          });
          saveData({ change: checkedSelectedNodes });
        }
      },
    ];
  };

  useEffect(() => {
    if (graph) {
      const items = getBindItems(graph);
      items.forEach(item => {
        graph.bindKey(item.keys, item.callback);
      });
    }
  }, [graph]);

  return (
    <></>
  );
}

export default KeyboardPanel;
