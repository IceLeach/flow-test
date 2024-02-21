/**
 * 左侧拖拽栏
 */

import React, { useMemo } from 'react';
import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Collapse, Tooltip } from 'antd';
import { InfoCircleOutlined, QuestionOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { createDragNode } from '../utils';
import { getShapeOptions, getShapeTitle, isValidShape } from '../register';
import { defaultZIndex, nodeMinSize } from '../config';
import { ComponentAssetType, ComponentConfigType } from '../types';
import { assets, tools } from './config';
import styles from './index.less';

export type DndAssetType = {
  id: string;
  name: string;
  /** 组件类型 */
  type: string;
  /** 是否已使用 */
  used: boolean;
}

type DndPanelProps = {
  graph: Graph | undefined;
  dndRef: React.MutableRefObject<Dnd | undefined>;
  dndAssets: DndAssetType[];
};

type DragNodeOptions = {
  shape: string;
  width?: number;
  height?: number;
  zIndex?: number;
  config?: ComponentConfigType;
  asset?: ComponentAssetType;
};

const DndPanel: React.FC<DndPanelProps> = (props) => {
  const { graph, dndRef, dndAssets } = props;

  const assetList = useMemo(() => {
    return dndAssets.filter(d => !d.used).map(d => {
      const shape = d.type;
      return {
        invalid: !isValidShape(shape),
        shape,
        asset: {
          id: d.id,
          name: d.name,
        },
      };
    });
  }, [dndAssets]);

  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, options: DragNodeOptions) => {
    if (!graph) return;
    const { shape, width, height, zIndex, config, asset } = options;
    const shapeOptions = getShapeOptions(shape);
    const node = createDragNode(graph, {
      shape,
      width: width ?? shapeOptions.width ?? nodeMinSize.width,
      height: height ?? shapeOptions.height ?? nodeMinSize.height,
      zIndex: zIndex ?? shapeOptions.zIndex ?? defaultZIndex,
      config: config ?? shapeOptions.config ?? {},
      asset,
    });
    dndRef.current?.start(node, e.nativeEvent);
  }

  return (
    <Collapse
      accordion
      ghost
      className={styles.dndPanel}
      defaultActiveKey='1'
      items={[
        {
          key: '1',
          label: '待部署设备',
          className: styles.assetsPanel,
          children: assetList.length ? (
            <div className={styles.assetsPanelBody}>
              {assetList.map(d => !d.invalid ? (
                <div
                  key={d.asset.id}
                  title={d.asset.name}
                  className={styles.dndItem}
                  onMouseDown={e => startDrag(e, d)}
                >
                  {assets[d.shape].icon ?? (<div style={{ width: 14, height: 14 }} />)}
                  <span className={styles.name}>{d.asset.name}</span>
                </div>
              ) : (
                <div key={d.asset.id} title={d.asset.name} className={classNames([styles.dndItem, styles.dndItemInvalid])}>
                  <QuestionOutlined />
                  <span className={styles.name}>{d.asset.name}</span>
                  <Tooltip
                    title="未知的设备类型"
                    overlayStyle={{ pointerEvents: 'none' }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <InfoCircleOutlined style={{ fontSize: 12 }} />
                    </div>
                  </Tooltip>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              暂无数据
            </div>
          ),
        },
        {
          key: '2',
          label: '工具',
          className: styles.toolsPanel,
          children: (
            <div className={styles.toolsPanelBody}>
              {tools.map((tool, index) => {
                return (
                  <div
                    key={index}
                    title={tool.title ?? getShapeTitle(tool.shape)}
                    className={styles.tool}
                    onMouseDown={e => startDrag(e, tool)}
                  >
                    {tool.icon}
                  </div>
                );
              })}
            </div>
          ),
        },
      ]}
    />
  );
}

export default DndPanel;
