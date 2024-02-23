import Icon from '@/components/Icon';
import { CustomComponent } from '../types';

const TAHS: CustomComponent = (props) => {
  const { node } = props;
  const { width, height } = node.getSize();
  const { env } = node.getData();
  const size = height < width ? height : width;
  const customSize = size < 16 ? size - 4 : size - 10;
  const color = env.type === 'plan' ? '#9ca0a3' : '#6DDF6D';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: `1px solid ${color}`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
      }}
    >
      <Icon type='icon-wenshiduchuanganqi' style={{ fontSize: customSize }} />
    </div>
  );
}

export default TAHS;
