import Icon from '@/components/Icon';
import UndirectedEquip from '@/components/configurationMap/mapGraphs/UndirectedEquip';
import { CustomComponent } from '../types';

const FIREBOTTLE: CustomComponent = () => {
  return (
    <UndirectedEquip
      borderColor='#EE6666'
      icon={<Icon type='icon-xiaofanggangping' />}
    />
  );
}

export default FIREBOTTLE;
