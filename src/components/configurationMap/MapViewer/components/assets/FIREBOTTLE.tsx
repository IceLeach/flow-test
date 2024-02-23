import Icon from '@/components/Icon';
import UndirectedEquip from '@/components/configurationMap/mapGraphs/UndirectedEquip';
import { CustomComponent } from '../types';

const FIREBOTTLE: CustomComponent = (props) => {
  const { node } = props;
  const { env } = node.getData();
  const color = env.type === 'plan' ? '#9ca0a3' : '#EE6666';

  return (
    <UndirectedEquip
      borderColor={color}
      icon={<Icon type='icon-xiaofanggangping' />}
    />
  );
}

export default FIREBOTTLE;
