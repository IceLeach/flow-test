import BatRackItem from '@/components/configurationMap/mapGraphs/BatRackItem';
import { CustomComponent } from '../types';

type BATRACKConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
  column: number;
  row: number;
};

const BATRACK: CustomComponent<BATRACKConfig> = (props) => {
  const { node } = props;
  const { config } = node.getData();
  const { direction, column, row } = config;

  const group: number[][] = [];
  let graphRow = row;
  let graphColumn = column;
  if (direction === 'right' || direction === 'left') {
    graphRow = column;
    graphColumn = row;
    for (let i = 0; i < column; i += 1) {
      group[i] = [];
      for (let j = 0; j < row; j += 1) {
        group[i][j] = 1;
      }
    }
  } else {
    for (let i = 0; i < row; i += 1) {
      group[i] = [];
      for (let j = 0; j < column; j += 1) {
        group[i][j] = 1;
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {group.map((groupRow, rowIndex) => (
        <div key={rowIndex} style={{ height: `calc(100% / ${graphRow})`, display: 'flex' }}>
          {groupRow.map((item, itemIndex) => (
            <div
              style={{ height: '100%', width: `calc(100% / ${graphColumn})` }}
              key={`${rowIndex}-${itemIndex}`}
            >
              <BatRackItem direction={direction ?? 'up'} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default BATRACK;
