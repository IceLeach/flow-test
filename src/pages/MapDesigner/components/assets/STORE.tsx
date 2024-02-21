import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type STOREConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const STORE: CustomComponent<STOREConfig> = (props) => {
  const { node } = props;
  const { config } = node.getData();

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor='#A8A8A8'
      icon={<Icon type='icon-jigui' />}
    />
  );
}

export default STORE;
