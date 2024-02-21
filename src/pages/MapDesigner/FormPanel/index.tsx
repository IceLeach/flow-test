/**
 * 右侧设置面板
 */

import React, { useEffect, useMemo } from 'react';
import { Graph, Node } from '@antv/x6';
import { excludeReadonlyCells, getNodeData, isAssetNode } from '../utils';
import { getShapeForm, getShapeTitle } from '../register';
import { ComponentNodeType } from '../types';
import { SaveCheck } from '..';
import { backgroundForm, defaultNodeForm } from './config';
import ConfigForm from './ConfigForm';
import styles from './index.less';

export type FormPanelActions = {
  reloadForm: () => void;
}

type FormPanelProps = {
  graph: Graph | undefined;
  backgroundNode?: Node;
  selectedNodes?: Node[];
  saveData: (saveCheck?: SaveCheck) => void;
  actionsRef: React.MutableRefObject<FormPanelActions | undefined>;
}

type FormDisplayNodeType = {
  type: 'node' | 'background';
  node: Node;
  data: ComponentNodeType;
}

const FormPanel: React.FC<FormPanelProps> = (props) => {
  const { graph, backgroundNode, selectedNodes, saveData, actionsRef } = props;
  const [formDisplayNode, setFormDisplayNode] = React.useState<FormDisplayNodeType | null>(null);

  const formSelectedNode = useMemo(() => {
    const checkedSelectedNodes = excludeReadonlyCells(selectedNodes ?? []) as Node[];
    return checkedSelectedNodes.length ? checkedSelectedNodes[0] : undefined;
  }, [selectedNodes]);

  const resetFormDisplayNode = () => {
    if (formSelectedNode) {
      setFormDisplayNode({
        type: 'node',
        node: formSelectedNode,
        data: getNodeData(formSelectedNode),
      });
    } else if (backgroundNode) {
      setFormDisplayNode({
        type: 'background',
        node: backgroundNode,
        data: getNodeData(backgroundNode),
      });
    } else {
      setFormDisplayNode(null);
    }
  }

  actionsRef.current = {
    reloadForm: resetFormDisplayNode,
  }

  useEffect(() => {
    resetFormDisplayNode();
  }, [formSelectedNode, backgroundNode]);

  useEffect(() => {
    if (formSelectedNode) {
      formSelectedNode.on('change:*', () => {
        resetFormDisplayNode();
      });
    } else if (backgroundNode) {
      backgroundNode.on('change:*', () => {
        resetFormDisplayNode();
      });
    }
  }, [formSelectedNode, backgroundNode]);

  /** 修改背景组件节点数据 */
  const setBackgroundNodeData = (options: { width?: number | null, height?: number | null }) => {
    if (!graph || !backgroundNode) return;
    const backgroundNodeSize = backgroundNode.getSize();
    backgroundNode.setSize({
      width: options.width ?? backgroundNodeSize.width,
      height: options.height ?? backgroundNodeSize.height,
    });
    saveData();
  }

  /** 修改组件节点数据 */
  const setFormNodeData = (callback: () => void, saveCheck?: SaveCheck) => {
    callback();
    saveData(saveCheck);
  }

  const form = useMemo(() => {
    if (!formDisplayNode) return '';
    if (formDisplayNode.type === 'background') {
      return (
        <ConfigForm items={backgroundForm(formDisplayNode.data, setBackgroundNodeData)} />
      );
    }
    const shapeForm = getShapeForm(formDisplayNode.data.shape);
    if (!shapeForm) {
      return (
        <ConfigForm items={defaultNodeForm({ data: formDisplayNode.data, node: formDisplayNode.node, update: setFormNodeData })} />
      );
    };
    return (
      <ConfigForm items={shapeForm({ data: formDisplayNode.data, node: formDisplayNode.node, update: setFormNodeData })} />
    );
  }, [formDisplayNode]);

  const formTitle = useMemo(() => {
    if (formDisplayNode?.type === 'node') {
      const isAsset = isAssetNode(formDisplayNode.node);
      const shapeTitle = getShapeTitle(formDisplayNode.data.shape);
      return `${shapeTitle ?? '未知组件'}${isAsset ? ` - ${formDisplayNode.node.getData().asset.name}` : ''}`;
    } else {
      return null;
    }
  }, [formDisplayNode]);

  return (
    <div className={styles.formPanel}>
      <div className={styles.header}>设置</div>
      <div className={styles.body}>
        <div className={styles.container}>
          {!!formTitle && (
            <div className={styles.shapeTitle} title={formTitle}>
              {formTitle}
            </div>
          )}
          {form}
        </div>
      </div>
    </div>
  );
}

export default FormPanel;
