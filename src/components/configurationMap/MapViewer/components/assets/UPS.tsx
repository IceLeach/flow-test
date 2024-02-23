import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type UPSConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const UPS: CustomComponent<UPSConfig> = (props) => {
  const { node } = props;
  const { config, env } = node.getData();
  const color = env.type === 'plan' ? '#9ca0a3' : '#FAC858';

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor={color}
      icon={<Icon type='icon-UPS' />}
    />
  );
}

export default UPS;
