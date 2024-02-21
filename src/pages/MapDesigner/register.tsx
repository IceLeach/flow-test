/**
 * 注册组件
 *
 * 所有组件必须先在registerNodeMap配置
 */

import { Node, Graph } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import { NodeFormItems, defaultAssetNodeForm, emptyNodeForm } from './FormPanel/config';
import { CustomComponent } from './components/types';
import Background from './components/Background';
import CustomNode from './components/CustomNode';
import Door, { DoorForm } from './components/Door';
import DbDoor, { DbDoorForm } from './components/DbDoor';
import DashedDoor from './components/DashedDoor';
import NodeText, { NodeTextForm } from './components/NodeText';
import Pillar from './components/Pillar';
import Wall, { WallForm } from './components/Wall';
import STORE from './components/assets/STORE';
import NET from './components/assets/NET';
import CAB from './components/assets/CAB';
import WIRING from './components/assets/WIRING';
import IT from './components/assets/IT';
import UPS from './components/assets/UPS';
import BAT from './components/assets/BAT';
import BATRACK, { BATRACKForm } from './components/assets/BATRACK';
import FIREHOST from './components/assets/FIREHOST';
import FIREBOTTLE from './components/assets/FIREBOTTLE';
import AC from './components/assets/AC';
import FRESHAIR from './components/assets/FRESHAIR';
import SD from './components/assets/SD';
import TAHS from './components/assets/TAHS';
import CAMERA from './components/assets/CAMERA';
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
  /** 选择时的设置表单 */
  form?: NodeFormItems<any>;
  /** 是否可缩放 默认为true */
  resizable?: boolean;
  /** 是否可重叠 默认为true */
  overlappable?: boolean;
  /** 是否可越界 默认为false */
  crossBackground?: boolean;
};

/** 组件清单 key值将作为组件类型 */
export const registerNodeMap: Record<string, RegisterNodeType> = {
  [backgroundNodeShape]: {
    component: Background,
    zIndex: 0,
    readonly: true,
  },
  'custom-node': {
    title: '自定义',
    component: CustomNode,
    width: 60,
    height: 60,
    zIndex: 10,
    config: { key: '0', value: '0' },
  },
  door: {
    title: '门',
    component: Door,
    width: 40,
    height: 40,
    form: DoorForm,
  },
  dbDoor: {
    title: '双门',
    component: DbDoor,
    width: 40,
    height: 40,
    form: DbDoorForm,
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
    form: NodeTextForm,
    crossBackground: true,
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
    form: WallForm,
  },
  STORE: {
    title: '存储柜',
    component: STORE,
    width: 60,
    height: 100,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  NET: {
    title: '网络柜',
    component: NET,
    width: 60,
    height: 100,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  CAB: {
    title: '配电柜',
    component: CAB,
    width: 60,
    height: 100,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  WIRING: {
    title: '光纤柜',
    component: WIRING,
    width: 60,
    height: 100,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  IT: {
    title: 'IT机柜',
    component: IT,
    width: 60,
    height: 100,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  UPS: {
    title: 'UPS',
    component: UPS,
    width: 60,
    height: 100,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  BAT: {
    title: '电池箱',
    component: BAT,
    width: 60,
    height: 100,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  BATRACK: {
    title: '电池架',
    component: BATRACK,
    width: 80,
    height: 51,
    config: { direction: 'up', column: 2, row: 3 },
    form: BATRACKForm,
    overlappable: false,
  },
  FIREHOST: {
    title: '消防主机',
    component: FIREHOST,
    width: 60,
    height: 100,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  FIREBOTTLE: {
    title: '消防钢瓶',
    component: FIREBOTTLE,
    width: 40,
    height: 40,
    overlappable: false,
  },
  AC: {
    title: '空调',
    component: AC,
    width: 180,
    height: 85,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  FRESHAIR: {
    title: '新风',
    component: FRESHAIR,
    width: 180,
    height: 85,
    config: { direction: 'up' },
    form: defaultAssetNodeForm,
    overlappable: false,
  },
  SD: {
    title: '烟感探测器',
    component: SD,
    width: 30,
    height: 30,
    form: emptyNodeForm,
    resizable: false,
    overlappable: false,
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
    form: emptyNodeForm,
    resizable: false,
    overlappable: false,
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

/** 获取组件类型的表单 */
export const getShapeForm = (shape: string) => {
  return registerNodeMap[shape].form;
}

/** 组件类型是否可缩放 */
export const shapeResizable = (shape: string) => {
  return registerNodeMap[shape].resizable ?? true;
}

/** 组件类型是否可重叠 */
export const shapeOverlappable = (shape: string) => {
  return registerNodeMap[shape].overlappable ?? true;
}

/** 组件类型是否可越界 */
export const shapeCrossBackground = (shape: string) => {
  return registerNodeMap[shape].crossBackground ?? false;
}
