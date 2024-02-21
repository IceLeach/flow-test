import { Checkbox, Input, InputNumber, Space } from 'antd';
import { NodeFormItems, nodeFormItemLab } from '../FormPanel/config';
import HexColorPicker from '../FormPanel/HexColorPicker';
import { setCellConfig } from '../utils';
import { CustomComponent } from './types';

type NodeTextConfig = {
  label: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

const NodeText: CustomComponent<NodeTextConfig> = (props) => {
  const { node } = props;
  const { config } = node.getData();
  const { label, fontSize, color, bold, italic, underline } = config;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize ?? 14,
        color: color ?? '#fff',
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
      }}
    >
      {label}
    </div>
  );
}

export default NodeText;

export const NodeTextForm: NodeFormItems<NodeTextConfig> = (options) => {
  const { data, node, update } = options;
  const config = data.data.config;
  return [
    nodeFormItemLab.width(options),
    nodeFormItemLab.height(options),
    {
      label: '文本',
      component: (
        <Input
          value={config.label}
          onChange={e => {
            const value = e.target.value;
            if (value) {
              update(() => {
                setCellConfig(node, { ...config, label: value });
              });
            }
          }}
        />
      ),
    },
    {
      label: '字号',
      component: (
        <InputNumber
          min={12}
          addonAfter='px'
          value={config.fontSize}
          onChange={value => {
            if (value) {
              update(() => {
                setCellConfig(node, { ...config, fontSize: value });
              });
            }
          }}
        />
      ),
    },
    {
      label: '颜色',
      component: (
        <HexColorPicker
          value={config.color}
          onChange={value => {
            update(() => {
              setCellConfig(node, { ...config, color: value });
            });
          }}
        />
      ),
    },
    {
      label: '样式',
      component: (
        <Space direction='vertical' size={8}>
          <Checkbox
            checked={config.bold}
            onChange={e => {
              update(() => {
                setCellConfig(node, { ...config, bold: e.target.checked });
              });
            }}
          >
            加粗
          </Checkbox>
          <Checkbox
            checked={config.italic}
            onChange={e => {
              update(() => {
                setCellConfig(node, { ...config, italic: e.target.checked });
              });
            }}
          >
            斜体
          </Checkbox>
          <Checkbox
            checked={config.underline}
            onChange={e => {
              update(() => {
                setCellConfig(node, { ...config, underline: e.target.checked });
              });
            }}
          >
            下划线
          </Checkbox>
        </Space>
      ),
    },
  ];
};
