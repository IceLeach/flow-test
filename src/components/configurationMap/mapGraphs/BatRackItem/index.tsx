import React from 'react';
import Icon from '@/components/Icon';
import styles from './index.less';

interface BatRackItemProps {
  direction: 'up' | 'right' | 'down' | 'left';
  color?: string;
}

const BatRackItem: React.FC<BatRackItemProps> = (props) => {
  const { direction, color = '#91cc75' } = props;

  return (
    <div className={styles.box} style={{ border: `1px solid ${color}` }}>
      {direction === 'right' ? (
        <div className={styles.containerVertical}>
          <div className={styles.innerBlock}>
            <div className={styles.iconBox} style={{ color: color }}>
              <Icon type="icon-zhengji" />
            </div>
          </div>
          <div className={styles.innerBlock}>
            <div className={styles.iconBox} style={{ color: color }}>
              <Icon type="icon-fuji" />
            </div>
          </div>
        </div>
      ) : direction === 'down' ? (
        <div className={styles.containerHorizontal}>
          <div className={styles.innerBlock}>
            <div className={styles.iconBox} style={{ color: color }}>
              <Icon type="icon-fuji" />
            </div>
          </div>
          <div className={styles.innerBlock}>
            <div className={styles.iconBox} style={{ color: color }}>
              <Icon type="icon-zhengji" />
            </div>
          </div>
        </div>
      ) : direction === 'left' ? (
        <div className={styles.containerVertical}>
          <div className={styles.innerBlock}>
            <div className={styles.iconBox} style={{ color: color }}>
              <Icon type="icon-fuji" />
            </div>
          </div>
          <div className={styles.innerBlock}>
            <div className={styles.iconBox} style={{ color: color }}>
              <Icon type="icon-zhengji" />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.containerHorizontal}>
          <div className={styles.innerBlock}>
            <div className={styles.iconBox} style={{ color: color }}>
              <Icon type="icon-zhengji" />
            </div>
          </div>
          <div className={styles.innerBlock}>
            <div className={styles.iconBox} style={{ color: color }}>
              <Icon type="icon-fuji" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(BatRackItem);
