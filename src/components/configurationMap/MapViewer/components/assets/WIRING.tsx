import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type WIRINGConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const WIRING: CustomComponent<WIRINGConfig> = (props) => {
  const { node } = props;
  const { config, env } = node.getData();
  const color = env.type === 'plan' ? '#9ca0a3' : '#00FEFF';

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor={color}
      icon={<Icon type='icon-jigui' />}
    />
  );
}

export default WIRING;
