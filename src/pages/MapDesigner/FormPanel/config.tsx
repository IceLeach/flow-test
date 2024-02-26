import { Node } from "@antv/x6";
import { InputNumber, Select } from "antd";
import { nodeMinSize } from "../config";
import { setCellConfig } from "../utils";
import { ComponentConfigType, ComponentNodeType } from "../types";
import { SaveCheck } from "..";
import SizeInputNumber from "./SizeInputNumber";

export type FormItemOptions = {
  label?: string;
  component: React.ReactNode;
  /** 无样式 直接渲染component */
  noStyle?: boolean;
}

type BackgroundFormItems = (data: ComponentNodeType, setBackgroundNodeData: (options: { width?: number | null, height?: number | null }) => void) => FormItemOptions[];

type NodeFormItemOptions<T extends ComponentConfigType = ComponentConfigType> = {
  data: ComponentNodeType<T>;
  node: Node;
  update: (callback: () => void, saveCheck?: SaveCheck) => void;
}

export type NodeFormItems<T extends ComponentConfigType = ComponentConfigType> = (options: NodeFormItemOptions<T>) => FormItemOptions[];

/** 背景表单 */
export const backgroundForm: BackgroundFormItems = (data, setBackgroundNodeData) => [
  {
    label: '房间宽度',
    component: (
      <SizeInputNumber
        min={100}
        value={data.size.width}
        onChange={value => setBackgroundNodeData({ width: value })}
      />
    ),
  },
  {
    label: '房间长度',
    component: (
      <SizeInputNumber
        min={100}
        value={data.size.height}
        onChange={value => setBackgroundNodeData({ height: value })}
      />
    ),
  },
];

type NodeFormItemLabKey = 'width' | 'height' | 'angle' | 'assetDirection';

/** 常用配置项 */
export const nodeFormItemLab: Record<NodeFormItemLabKey, (options: NodeFormItemOptions) => FormItemOptions> = {
  width: ({ data, node, update }) => ({
    label: '宽度',
    component: (
      <SizeInputNumber
        min={nodeMinSize.width}
        value={data.size.width}
        onChange={value => {
          const size = node.getSize();
          if (value) {
            update(() => {
              node.setSize({ ...size, width: value ?? size.width });
            }, { change: [node] });
          }
        }}
      />
    ),
  }),
  height: ({ data, node, update }) => ({
    label: '长度',
    component: (
      <SizeInputNumber
        min={nodeMinSize.height}
        value={data.size.height}
        onChange={value => {
          const size = node.getSize();
          if (value) {
            update(() => {
              node.setSize({ ...size, height: value ?? size.height });
            }, { change: [node] });
          }
        }}
      />
    ),
  }),
  angle: ({ data, node, update }) => ({
    label: '旋转角度',
    component: (
      <InputNumber
        min={0}
        max={360}
        addonAfter='度'
        value={data.angle}
        onChange={value => {
          if (typeof (value) === 'number') {
            update(() => {
              node.rotate(value, { absolute: true });
            }, { change: [node] });
          }
        }}
      />
    ),
  }),
  assetDirection: ({ data, node, update }) => {
    const config = data.data.config;
    return ({
      label: '方向',
      component: (
        <Select
          value={config.direction}
          options={[
            { label: '上', value: 'up' },
            { label: '右', value: 'right' },
            { label: '下', value: 'down' },
            { label: '左', value: 'left' },
          ]}
          onChange={(value) => {
            const size = node.getSize();
            if (
              ((config.direction === 'up' || config.direction === 'down') &&
                (value === 'left' || value === 'right')) ||
              ((config.direction === 'left' || config.direction === 'right') &&
                (value === 'up' || value === 'down'))
            ) {
              update(() => {
                node.setSize({ width: size.height, height: size.width });
                setCellConfig(node, { ...config, direction: value });
              }, { change: [node] });
            } else {
              update(() => {
                setCellConfig(node, { ...config, direction: value });
              });
            }
          }}
        />
      ),
    });
  }
};

/** 默认的组件表单配置项 在没有为组件定义form时使用 */
export const defaultNodeForm: NodeFormItems = (options) => [
  nodeFormItemLab.width(options),
  nodeFormItemLab.height(options),
];

/** 默认的资产组件表单配置项 */
export const defaultAssetNodeForm: NodeFormItems<{ direction: 'up' | 'right' | 'down' | 'left' }> = (options) => [
  nodeFormItemLab.assetDirection(options),
  nodeFormItemLab.width(options),
  nodeFormItemLab.height(options),
];

/** 空的组件表单配置项 */
export const emptyNodeForm: NodeFormItems = () => [];
