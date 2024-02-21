/**
 * 顶部工具栏
 */

import React, { useMemo } from 'react';
import { Graph, Node } from '@antv/x6';
import { Button, Tooltip } from 'antd';
import { CompressOutlined, DeleteOutlined, RedoOutlined, UndoOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { backCell, excludeReadonlyCells, frontCell, getGraphData } from '../utils';
import { HistoryType } from '../types';
import { SaveCheck } from '..';
import styles from './index.less';

type ToolbarPanelProps = {
  graph: Graph | undefined;
  selectedNodes?: Node[];
  history?: HistoryType;
  saveData: (saveCheck?: SaveCheck) => void;
};

type IconButtonProps = {
  title: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { title, disabled, onClick, children } = props;

  return (
    <Tooltip title={title} placement='bottom' mouseLeaveDelay={0}>
      <div
        className={classNames([styles.iconButton, disabled ? styles.iconButtonDisabled : null])}
        onClick={() => {
          if (!disabled) {
            onClick();
          }
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
}

const ToolbarPanel: React.FC<ToolbarPanelProps> = (props) => {
  const { selectedNodes, graph, history, saveData } = props;

  const checkedSelectedNodes = useMemo(() => {
    return excludeReadonlyCells(selectedNodes ?? []) as Node[];
  }, [selectedNodes]);

  const undo = () => {
    if (history?.canUndo) {
      history.undo();
    }
  }
  const redo = () => {
    if (history?.canRedo) {
      history.redo();
    }
  }

  const front = () => {
    if (!graph) return;
    const actionList: boolean[] = [];
    checkedSelectedNodes?.forEach(node => {
      const isOk = frontCell(graph, node);
      actionList.push(isOk);
    });
    if (actionList.includes(true)) {
      saveData();
    }
  }
  const back = () => {
    if (!graph) return;
    const actionList: boolean[] = [];
    checkedSelectedNodes?.forEach(node => {
      const isOk = backCell(graph, node);
      actionList.push(isOk);
    });
    if (actionList.includes(true)) {
      saveData();
    }
  }
  const deleteItems = () => {
    if (!graph || !checkedSelectedNodes?.length) return;
    graph.removeCells(checkedSelectedNodes);
    saveData({ remove: checkedSelectedNodes });
  }

  const zoomIn = () => {
    if (!graph) return;
    graph.zoom(0.1);
  }
  const zoomOut = () => {
    if (!graph) return;
    graph.zoom(-0.1);
  }
  const zoomFit = () => {
    if (!graph) return;
    graph.zoomToFit();
  }

  const save = () => {
    if (!graph) return;
    const data = getGraphData(graph);
    console.log('save', data)
  }

  return (
    <div className={styles.toolbarPanel}>
      <div className={styles.left}>
        <IconButton disabled={!history?.canUndo} title='撤销' onClick={undo}>
          <UndoOutlined />
        </IconButton>
        <IconButton disabled={!history?.canRedo} title='重做' onClick={redo}>
          <RedoOutlined />
        </IconButton>
        <IconButton disabled={!checkedSelectedNodes?.length} title='置前' onClick={front}>
          <VerticalAlignTopOutlined />
        </IconButton>
        <IconButton disabled={!checkedSelectedNodes?.length} title='置后' onClick={back}>
          <VerticalAlignBottomOutlined />
        </IconButton>
        <IconButton disabled={!checkedSelectedNodes?.length} title='删除' onClick={deleteItems}>
          <DeleteOutlined />
        </IconButton>
        <IconButton title='放大' onClick={zoomIn}>
          <ZoomInOutlined />
        </IconButton>
        <IconButton title='缩小' onClick={zoomOut}>
          <ZoomOutOutlined />
        </IconButton>
        <IconButton title='缩放到适应屏幕' onClick={zoomFit}>
          <CompressOutlined />
        </IconButton>
      </div>
      <div className={styles.right}>
        <Button type='primary' onClick={save}>保存</Button>
      </div>
    </div>
  );
}

export default ToolbarPanel;
