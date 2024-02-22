import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type BATConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const BAT: CustomComponent<BATConfig> = (props) => {
  const { node } = props;
  const { config } = node.getData();

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor='#91CC75'
      icon={<Icon type='icon-a-dianchixiangdianchijia' />}
    />
  );
}

export default BAT;
