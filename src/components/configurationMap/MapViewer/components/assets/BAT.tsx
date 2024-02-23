import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type BATConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const BAT: CustomComponent<BATConfig> = (props) => {
  const { node } = props;
  const { config, env } = node.getData();
  const color = env.type === 'plan' ? '#9ca0a3' : '#91CC75';

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor={color}
      icon={<Icon type='icon-a-dianchixiangdianchijia' />}
    />
  );
}

export default BAT;
