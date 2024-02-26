/**
 * 注册组件
 *
 * 所有组件必须先在registerNodeMap配置
 */

import { Node, Graph } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import { CustomComponent } from './components/types';
import Background from './components/Background';
import Door from './components/Door';
import DbDoor from './components/DbDoor';
import DashedDoor from './components/DashedDoor';
import NodeText from './components/NodeText';
import Pillar from './components/Pillar';
import Wall from './components/Wall';
import STORE from './components/assets/STORE';
import NET from './components/assets/NET';
import CAB from './components/assets/CAB';
import WIRING from './components/assets/WIRING';
import IT from './components/assets/IT';
import UPS from './components/assets/UPS';
import BAT from './components/assets/BAT';
import BATRACK from './components/assets/BATRACK';
import FIREHOST from './components/assets/FIREHOST';
import FIREBOTTLE from './components/assets/FIREBOTTLE';
import AC from './components/assets/AC';
import FRESHAIR from './components/assets/FRESHAIR';
import SD from './components/assets/SD';
import TAHS from './components/assets/TAHS';
import CAMERA from './components/assets/CAMERA';
import EnvHeatmap from './components/env/EnvHeatmap';
import { backgroundNodeShape } from './config';
import { ComponentConfigType } from './types';

/** 组件定义 */
type RegisterNodeType = {
  /** 组件类型的名称 */
  title?: string;
  component: CustomComponent<any>;
  /** 默认宽度 */
  width?: number;
  /** 默认高度 */
  height?: number;
  /** 默认层级 */
  zIndex?: number;
  /** 默认业务数据 加载数据时会被合并 */
  config?: ComponentConfigType;
  /** 是否为只读组件 只读组件不能修改 */
  readonly?: boolean;
};

/** 组件清单 key值将作为组件类型 */
export const registerNodeMap: Record<string, RegisterNodeType> = {
  [backgroundNodeShape]: {
    component: Background,
    zIndex: 0,
    readonly: true,
  },
  heatmap: {
    component: EnvHeatmap,
    zIndex: 9999,
    readonly: true,
  },
  door: {
    title: '门',
    component: Door,
    width: 40,
    height: 40,
  },
  dbDoor: {
    title: '双门',
    component: DbDoor,
    width: 40,
    height: 40,
  },
  dashedDoor: {
    title: '门',
    component: DashedDoor,
    width: 80,
    height: 10,
  },
  text: {
    title: '文本',
    component: NodeText,
    width: 70,
    height: 40,
    config: {
      label: '文本',
      fontSize: 14,
      color: '#C6CDC9',
      bold: false,
      italic: false,
      underline: false,
    },
  },
  pillar: {
    title: '柱子',
    component: Pillar,
    width: 40,
    height: 40,
  },
  wall: {
    title: '墙',
    component: Wall,
    width: 100,
    height: 10,
  },
  STORE: {
    title: '存储柜',
    component: STORE,
    width: 60,
    height: 100,
    config: { direction: 'up' },
  },
  NET: {
    title: '网络柜',
    component: NET,
    width: 60,
    height: 100,
    config: { direction: 'up' },
  },
  CAB: {
    title: '配电柜',
    component: CAB,
    width: 60,
    height: 100,
    config: { direction: 'up' },
  },
  WIRING: {
    title: '光纤柜',
    component: WIRING,
    width: 60,
    height: 100,
    config: { direction: 'up' },
  },
  IT: {
    title: 'IT机柜',
    component: IT,
    width: 60,
    height: 100,
    config: { direction: 'up' },
  },
  UPS: {
    title: 'UPS',
    component: UPS,
    width: 60,
    height: 100,
    config: { direction: 'up' },
  },
  BAT: {
    title: '电池箱',
    component: BAT,
    width: 60,
    height: 100,
    config: { direction: 'up' },
  },
  BATRACK: {
    title: '电池架',
    component: BATRACK,
    width: 80,
    height: 51,
    config: { direction: 'up', column: 2, row: 3 },
  },
  FIREHOST: {
    title: '消防主机',
    component: FIREHOST,
    width: 60,
    height: 100,
    config: { direction: 'up' },
  },
  FIREBOTTLE: {
    title: '消防钢瓶',
    component: FIREBOTTLE,
    width: 40,
    height: 40,
  },
  AC: {
    title: '空调',
    component: AC,
    width: 180,
    height: 85,
    config: { direction: 'up' },
  },
  FRESHAIR: {
    title: '新风',
    component: FRESHAIR,
    width: 180,
    height: 85,
    config: { direction: 'up' },
  },
  SD: {
    title: '烟感探测器',
    component: SD,
    width: 30,
    height: 30,
  },
  TAHS: {
    title: '温湿度传感器',
    component: TAHS,
    width: 15,
    height: 15,
  },
  CAMERA: {
    title: '摄像头',
    component: CAMERA,
    width: 30,
    height: 30,
  },
}

/** 注册组件 需要在加载数据前执行 */
export const registerNode = () => {
  Object.entries(registerNodeMap).forEach(([key, nodeConfig]) => {
    register({
      shape: key,
      component: nodeConfig.component as React.ComponentType<{ node: Node; graph: Graph }>,
      width: nodeConfig.width,
      height: nodeConfig.height,
      zIndex: nodeConfig.zIndex,
      data: nodeConfig.config ? { config: nodeConfig.config } : undefined,
    });
  });
}

/** 判断是否是有效的组件类型 */
export const isValidShape = (shape: string) => {
  return !!registerNodeMap[shape];
}

/** 判断是否为只读的组件类型 */
export const shapeIsReadonly = (shape: string) => {
  return registerNodeMap[shape]?.readonly === true;
}

/** 获取组件定义配置 */
export const getShapeOptions = (shape: string) => {
  return registerNodeMap[shape];
}

/** 获取组件类型的默认层级 */
export const getShapeZIndex = (shape: string) => {
  return registerNodeMap[shape]?.zIndex;
}

/** 获取组件类型的名称 */
export const getShapeTitle = (shape: string) => {
  return registerNodeMap[shape]?.title;
}
