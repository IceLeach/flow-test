import Icon from '@/components/Icon';
import { CustomComponent } from '../types';

const CAMERA: CustomComponent = (props) => {
  const { node } = props;
  const { width, height } = node.getSize();
  const { env } = node.getData();
  const size = height < width ? height : width;
  const color = env.type === 'plan' ? '#9ca0a3' : '#8FABFF';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon type='icon-shexiang1' style={{ fontSize: size }} />
    </div>
  );
}

export default CAMERA;
