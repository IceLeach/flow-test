import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type CABConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const CAB: CustomComponent<CABConfig> = (props) => {
  const { node } = props;
  const { config } = node.getData();

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor='#EE6666'
      icon={<Icon type='icon-shandian' />}
    />
  );
}

export default CAB;
