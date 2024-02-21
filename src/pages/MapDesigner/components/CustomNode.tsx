import { CustomComponent } from './types';

const CustomNode: CustomComponent = (props) => {
  const { node } = props;
  // const consoleData = {
  //   getData: node.getData(),
  //   getSize: node.getSize(),
  //   getPosition: node.getPosition(),
  //   getZIndex: node.getZIndex(),
  //   getAngle: node.getAngle(),
  //   shape: node.shape,
  //   id: node.id,
  // };
  // console.log('data', consoleData)

  return (
    <div style={{ width: '100%', height: '100%', border: '1px solid #000', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>Custom</div>
  );
}

export default CustomNode;
