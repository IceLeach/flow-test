import Icon from '@/components/Icon';
import { Select } from 'antd';
import { NodeFormItems, nodeFormItemLab } from '../FormPanel/config';
import { setCellConfig } from '../utils';
import { CustomComponent } from './types';

type DoorConfig = {
  direction: 'upLeft' | 'rightUp' | 'downRight' | 'leftDown' | 'upRight' | 'rightDown' | 'downLeft' | 'leftUp';
};

const iconMap: Record<DoorConfig['direction'], React.ReactNode> = {
  upLeft: <Icon type='icon-men' />,
  rightUp: <Icon type='icon-men' style={{ transform: 'rotate(90deg)' }} />,
  downRight: <Icon type='icon-men' style={{ transform: 'rotate(180deg)' }} />,
  leftDown: <Icon type='icon-men' style={{ transform: 'rotate(-90deg)' }} />,
  upRight: <Icon type='icon-men' style={{ transform: 'rotateY(180deg)' }} />,
  rightDown: <Icon type='icon-men' style={{ transform: 'rotateY(180deg) rotate(-90deg)' }} />,
  downLeft: <Icon type='icon-men' style={{ transform: 'rotateY(180deg) rotate(180deg)' }} />,
  leftUp: <Icon type='icon-men' style={{ transform: 'rotateY(180deg) rotate(90deg)' }} />,
};

const Door: CustomComponent<DoorConfig> = (props) => {
  const { node } = props;
  const { width, height } = node.getSize();
  const { config } = node.getData();
  const direction = config?.direction ?? 'upLeft';
  const icon = iconMap[direction];

  return (
    <div style={{ width: '100%', height: '100%', color: '#A7B0AB' }}>
      <div style={{ fontSize: 10, width: 10, height: 10, display: 'flex', transformOrigin: 'left top', transform: `scale(${width / 10},${height / 10})` }}>
        {icon}
      </div>
    </div>
  );
}

export default Door;

const IconLabel: React.FC<{ label: string; icon: React.ReactNode }> = (props) => {
  const { label, icon } = props;

  return (
    <div style={{ display: 'flex', alignContent: 'center' }}>
      <div>{label}</div>
      <div style={{ marginLeft: 4 }}>{icon}</div>
    </div>
  );
}

export const DoorForm: NodeFormItems<DoorConfig> = (options) => {
  const { data, node, update } = options;
  const config = data.data.config;
  return [
    {
      label: '方向',
      component: (
        <Select
          value={config.direction}
          options={[
            { label: <IconLabel label='上左' icon={iconMap.upLeft} />, value: 'upLeft' },
            { label: <IconLabel label='右上' icon={iconMap.rightUp} />, value: 'rightUp' },
            { label: <IconLabel label='下右' icon={iconMap.downRight} />, value: 'downRight' },
            { label: <IconLabel label='左下' icon={iconMap.leftDown} />, value: 'leftDown' },
            { label: <IconLabel label='上右' icon={iconMap.upRight} />, value: 'upRight' },
            { label: <IconLabel label='右下' icon={iconMap.rightDown} />, value: 'rightDown' },
            { label: <IconLabel label='下左' icon={iconMap.downLeft} />, value: 'downLeft' },
            { label: <IconLabel label='左上' icon={iconMap.leftUp} />, value: 'leftUp' },
          ]}
          onChange={value => {
            update(() => {
              setCellConfig(node, { ...config, direction: value });
            });
          }}
        />
      ),
    },
    nodeFormItemLab.width(options),
    nodeFormItemLab.height(options),
  ];
};
