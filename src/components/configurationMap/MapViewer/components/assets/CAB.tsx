import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { CustomComponent } from '../types';

type CABConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const CAB: CustomComponent<CABConfig> = (props) => {
  const { node } = props;
  const { config, env } = node.getData();
  const color = env.type === 'plan' ? '#9ca0a3' : '#EE6666';

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor={color}
      icon={<Icon type='icon-shandian' />}
    />
  );
}

export default CAB;
