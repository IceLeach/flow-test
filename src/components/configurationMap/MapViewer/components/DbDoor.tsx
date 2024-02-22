import Icon from '@/components/Icon';
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
