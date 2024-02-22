import Icon from '@/components/Icon';
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
