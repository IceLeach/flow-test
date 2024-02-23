import Icon from '@/components/Icon';
import DirectedEquip from '@/components/configurationMap/mapGraphs/DirectedEquip';
import { PlanModeItemStatus } from '../../types';
import { CustomComponent } from '../types';

type ITConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const statusColorMap: Record<PlanModeItemStatus, string> = {
  HH: '#FF3D00',
  H: '#FF9100',
  M: '#FFEA00',
  L: '#76FF03',
  LL: '#00B0FF',
}

const IT: CustomComponent<ITConfig> = (props) => {
  const { node } = props;
  const { config, env } = node.getData();
  const color = env.type === 'plan' ? env.status ? statusColorMap[env.status] : '#9CA0A3' : '#00FEFF';

  return (
    <DirectedEquip
      direction={config?.direction ?? 'up'}
      borderColor={color}
      icon={<Icon type='icon-jigui' />}
    />
  );
}

export default IT;
