import { NodeFormItems, nodeFormItemLab } from '../FormPanel/config';
import { CustomComponent } from './types';

const Wall: CustomComponent = () => {
  return (
    <div style={{ height: '100%', background: '#C6CDC9' }} />
  );
}

export default Wall;

export const WallForm: NodeFormItems = (options) => {
  return [
    nodeFormItemLab.angle(options),
    nodeFormItemLab.width(options),
    nodeFormItemLab.height(options),
  ];
};
