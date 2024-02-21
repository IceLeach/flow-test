import React from 'react';
import styles from './index.less';

interface UndirectedEquipProps {
  backgroundColor?: string;
  borderColor?: string;
  icon: React.ReactNode;
}

const UndirectedEquip: React.FC<UndirectedEquipProps> = (props) => {
  const { backgroundColor = 'transparent', borderColor = '#fff', icon } = props;

  return (
    <div className={styles.box} style={{ background: backgroundColor }}>
      <div className={styles.innerBox} style={{ borderColor: borderColor }}>
        <div className={styles.container}>
          <div className={styles.iconInnerBox} style={{ color: borderColor }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UndirectedEquip);
