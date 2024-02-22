import Icon from '@/components/Icon';
import { CustomComponent } from '../types';

const CAMERA: CustomComponent = (props) => {
  const { node } = props;
  const { width, height } = node.getSize();
  const size = height < width ? height : width;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        color: '#8FABFF',
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
