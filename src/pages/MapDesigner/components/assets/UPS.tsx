import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type UPSConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const UPS: CustomComponent<UPSConfig> = (props) => {
  const { node } = props;
  const { config } = node.getData();

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor='#FAC858'
      icon={<Icon type='icon-UPS' />}
    />
  );
}

export default UPS;
