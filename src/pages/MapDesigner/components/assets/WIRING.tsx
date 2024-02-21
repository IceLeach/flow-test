import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type WIRINGConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const WIRING: CustomComponent<WIRINGConfig> = (props) => {
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

export default WIRING;
