import React from 'react';
import styles from './index.less';

interface DirectedEquipProps {
  direction: 'up' | 'right' | 'down' | 'left';
  backgroundColor?: string;
  borderColor?: string;
  icon: React.ReactNode;
}

const DirectedEquip: React.FC<DirectedEquipProps> = (props) => {
  const { direction, backgroundColor = 'transparent', borderColor = '#fff', icon } = props;

  return (
    <div className={styles.box} style={{ background: backgroundColor }}>
      <div className={styles.innerBox} style={{ borderColor: borderColor }}>
        {direction === 'right' ? (
          <div className={styles.containerHorizontal}>
            <div className={styles.iconBlock}>
              <div className={styles.iconInnerBox} style={{ color: borderColor }}>
                {icon}
              </div>
            </div>
            <div className={styles.indicationBody}>
              <div
                className={styles.indicationVertical}
                style={{ margin: '3px auto 3px 0', borderColor: borderColor }}
              />
            </div>
          </div>
        ) : direction === 'down' ? (
          <div className={styles.containerVertical}>
            <div className={styles.iconBlock}>
              <div className={styles.iconInnerBox} style={{ color: borderColor }}>
                {icon}
              </div>
            </div>
            <div className={styles.indicationBody}>
              <div
                className={styles.indicationHorizontal}
                style={{ margin: '0 3px auto', borderColor: borderColor }}
              />
            </div>
          </div>
        ) : direction === 'left' ? (
          <div className={styles.containerHorizontal} style={{ flexDirection: 'row-reverse' }}>
            <div className={styles.iconBlock}>
              <div className={styles.iconInnerBox} style={{ color: borderColor }}>
                {icon}
              </div>
            </div>
            <div className={styles.indicationBody}>
              <div
                className={styles.indicationVertical}
                style={{ margin: '3px 0 3px auto', borderColor: borderColor }}
              />
            </div>
          </div>
        ) : (
          <div className={styles.containerVertical} style={{ flexDirection: 'column-reverse' }}>
            <div className={styles.iconBlock} style={{ height: '90%' }}>
              <div className={styles.iconInnerBox} style={{ color: borderColor }}>
                {icon}
              </div>
            </div>
            <div className={styles.indicationBody}>
              <div
                className={styles.indicationHorizontal}
                style={{ margin: 'auto 3px 0', borderColor: borderColor }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DirectedEquip);
