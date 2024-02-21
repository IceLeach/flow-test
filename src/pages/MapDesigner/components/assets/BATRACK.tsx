import { InputNumber } from 'antd';
import BatRackItem from '@/components/configurationMap/mapGraphs/BatRackItem';
import SizeInputNumber from '../../FormPanel/SizeInputNumber';
import { NodeFormItems, nodeFormItemLab } from '../../FormPanel/config';
import { setCellConfig } from '../../utils';
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

export const BATRACKForm: NodeFormItems<BATRACKConfig> = (options) => {
  const { data, node, update } = options;
  const config = data.data.config;
  const size = node.getSize();
  return [
    nodeFormItemLab.assetDirection(options),
    {
      label: '排数',
      component: (
        <InputNumber
          style={{ width: '100%' }}
          min={1}
          precision={0}
          value={config.column}
          onChange={value => {
            const size = node.getSize();
            if (value && value % 1 === 0) {
              const vertical = !(
                config?.direction === 'left' || config?.direction === 'right'
              );
              if (vertical) {
                update(() => {
                  node.setSize({ ...size, width: (size.width / config.column) * value });
                  setCellConfig(node, { ...config, column: value });
                }, { change: [node] });
              } else {
                update(() => {
                  node.setSize({ ...size, height: (size.height / config.column) * value });
                  setCellConfig(node, { ...config, column: value });
                }, { change: [node] });
              }
            }
          }}
        />
      ),
    },
    {
      label: '每排节数',
      component: (
        <InputNumber
          style={{ width: '100%' }}
          min={1}
          precision={0}
          value={config.row}
          onChange={value => {
            const size = node.getSize();
            if (value && value % 1 === 0) {
              const vertical = !(
                config?.direction === 'left' || config?.direction === 'right'
              );
              if (vertical) {
                update(() => {
                  node.setSize({ ...size, height: (size.height / config.row) * value });
                  setCellConfig(node, { ...config, row: value });
                }, { change: [node] });
              } else {
                update(() => {
                  node.setSize({ ...size, width: (size.width / config.row) * value });
                  setCellConfig(node, { ...config, row: value });
                }, { change: [node] });
              }
            }
          }}
        />
      ),
    },
    {
      label: '每节宽度',
      component: (
        <SizeInputNumber
          min={5}
          value={size.width / (config.direction === 'left' || config.direction === 'right' ? config?.row : config?.column)}
          onChange={value => {
            const size = node.getSize();
            if (value) {
              update(() => {
                node.setSize({ ...size, width: value * (config.direction === 'left' || config.direction === 'right' ? config.row : config.column) });
              }, { change: [node] });
            }
          }}
        />
      ),
    },
    {
      label: '每节长度',
      component: (
        <SizeInputNumber
          min={5}
          value={size.height / (config.direction === 'left' || config.direction === 'right' ? config?.column : config?.row)}
          onChange={value => {
            const size = node.getSize();
            if (value) {
              update(() => {
                node.setSize({ ...size, height: value * (config.direction === 'left' || config.direction === 'right' ? config.column : config.row) });
              }, { change: [node] });
            }
          }}
        />
      ),
    },
  ];
};
