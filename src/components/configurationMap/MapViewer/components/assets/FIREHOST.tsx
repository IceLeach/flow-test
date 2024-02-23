import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type FIREHOSTConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const FIREHOST: CustomComponent<FIREHOSTConfig> = (props) => {
  const { node } = props;
  const { config, env } = node.getData();
  const color = env.type === 'plan' ? '#9ca0a3' : '#FC8452';

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor={color}
      icon={<Icon type='icon-yangan' />}
    />
  );
}

export default FIREHOST;
