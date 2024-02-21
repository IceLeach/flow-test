import Icon from '@/components/Icon';
import { Select } from 'antd';
import { NodeFormItems, nodeFormItemLab } from '../FormPanel/config';
import { setCellConfig } from '../utils';
import { CustomComponent } from './types';

type DbDoorConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const iconMap: Record<DbDoorConfig['direction'], React.ReactNode> = {
  up: <Icon type='icon-shuangkaimen' />,
  right: <Icon type='icon-shuangkaimen' style={{ transform: 'rotate(90deg)' }} />,
  down: <Icon type='icon-shuangkaimen' style={{ transform: 'rotate(180deg)' }} />,
  left: <Icon type='icon-shuangkaimen' style={{ transform: 'rotate(-90deg)' }} />,
};

const DbDoor: CustomComponent<DbDoorConfig> = (props) => {
  const { node } = props;
  const { width, height } = node.getSize();
  const { config } = node.getData();
  const direction = config?.direction ?? 'up';
  const icon = iconMap[direction];

  return (
    <div style={{ width: '100%', height: '100%', color: '#A7B0AB' }}>
      <div style={{ fontSize: 10, width: 10, height: 10, display: 'flex', transformOrigin: 'left top', transform: `scale(${width / 10},${height / 10})` }}>
        {icon}
      </div>
    </div>
  );
}

export default DbDoor;

const IconLabel: React.FC<{ label: string; icon: React.ReactNode }> = (props) => {
  const { label, icon } = props;

  return (
    <div style={{ display: 'flex', alignContent: 'center' }}>
      <div>{label}</div>
      <div style={{ marginLeft: 4 }}>{icon}</div>
    </div>
  );
}

export const DbDoorForm: NodeFormItems<DbDoorConfig> = (options) => {
  const { data, node, update } = options;
  const config = data.data.config;
  return [
    {
      label: '方向',
      component: (
        <Select
          value={config.direction}
          options={[
            { label: <IconLabel label='上' icon={iconMap.up} />, value: 'up' },
            { label: <IconLabel label='右' icon={iconMap.right} />, value: 'right' },
            { label: <IconLabel label='下' icon={iconMap.down} />, value: 'down' },
            { label: <IconLabel label='左' icon={iconMap.left} />, value: 'left' },
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
