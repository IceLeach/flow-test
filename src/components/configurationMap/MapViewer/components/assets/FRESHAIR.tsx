import Icon from '@/components/Icon';
import { CustomComponent } from '../types';
import globalStyle from '../nodeGlobalStyle.less';

type FRESHAIRConfig = {
  direction: 'up' | 'right' | 'down' | 'left';
};

const FRESHAIR: CustomComponent<FRESHAIRConfig> = (props) => {
  const { node } = props;
  const { config, env } = node.getData();
  const direction = config?.direction ?? 'up';
  const color = env.type === 'plan' ? '#9ca0a3' : '#73C0DE';

  const horizontalComponent = (transform: boolean = false) => (
    <div
      style={{
        display: 'flex',
        border: `2px solid ${color}`,
        borderRadius: 4,
        width: '100%',
        height: '100%',
        transform: `rotate(${transform ? 180 : 0}deg)`,
      }}
    >
      <div
        style={{
          width: '70%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '70%',
            height: '70%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          <Icon type="icon-xinfeng1" className={globalStyle.resizeIcon} />
        </div>
      </div>
      <div
        style={{
          width: '30%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        <div style={{ height: 2, width: '80%', background: color }} />
        <div style={{ height: 2, width: '80%', background: color }} />
        <div style={{ height: 2, width: '80%', background: color }} />
        <div style={{ height: 2, width: '80%', background: color }} />
      </div>
    </div>
  );
  const verticalComponent = (transform: boolean = false) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${color}`,
        width: '100%',
        height: '100%',
        transform: `rotate(${transform ? 180 : 0}deg)`,
      }}
    >
      <div
        style={{
          height: '70%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '70%',
            height: '70%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          <Icon type="icon-xinfeng1" className={globalStyle.resizeIcon} />
        </div>
      </div>
      <div
        style={{ height: '30%', width: '100%', display: 'flex', justifyContent: 'space-evenly' }}
      >
        <div style={{ width: 2, height: '80%', background: color }} />
        <div style={{ width: 2, height: '80%', background: color }} />
        <div style={{ width: 2, height: '80%', background: color }} />
        <div style={{ width: 2, height: '80%', background: color }} />
      </div>
    </div>
  );

  return direction === 'up'
    ? horizontalComponent()
    : direction === 'right'
      ? verticalComponent()
      : direction === 'down'
        ? horizontalComponent(true)
        : verticalComponent(true);
}

export default FRESHAIR;
