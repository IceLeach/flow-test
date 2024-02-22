import { CustomComponent } from './types';

const DashedDoor: CustomComponent = (props) => {
  const { node } = props;
  const { width, height } = node.getSize();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(${height < width ? '90deg' : '180deg'}, #A7B0AB 0%,#A7B0AB 9.1%,transparent 9.1%, transparent 18.18%,#A7B0AB 18.18%,#A7B0AB 27.28%,transparent 27.28%, transparent 36.36%,#A7B0AB 36.36%,#A7B0AB 45.46%,transparent 45.46%, transparent 54.54%,#A7B0AB 54.54%,#A7B0AB 63.64%,transparent 63.64%, transparent 72.72%,#A7B0AB 72.72%,#A7B0AB 81.82%,transparent 81.82%, transparent 90.9%,#A7B0AB 90.9%,#A7B0AB 100%)`,
      }}
    />
  );
}

export default DashedDoor;
