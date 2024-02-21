import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type FIREHOSTConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const FIREHOST: CustomComponent<FIREHOSTConfig> = (props) => {
  const { node } = props;
  const { config } = node.getData();

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor='#FC8452'
      icon={<Icon type='icon-yangan' />}
    />
  );
}

export default FIREHOST;
