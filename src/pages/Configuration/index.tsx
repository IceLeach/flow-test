import React, { useRef, useState } from 'react';
import MapDesigner from '../MapDesigner';
import styles from './index.less';

const Configuration: React.FC = () => {
  const dndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [designerStatus, setDesignerStatus] = useState<'loading' | 'finished' | 'error'>('finished');

  return (
    <div className={styles.configuration}>
      <div className={styles.leftBar}>
        <div className={styles.tree}></div>
        <div ref={dndRef} className={styles.dndContainer} />
      </div>
      <div className={styles.main}>
        <MapDesigner
          roomId={1}
          dndPanelContainerRef={dndRef}
          onStatusChange={status => setDesignerStatus(status)}
        />
      </div>
    </div>
  );
}

export default Configuration;
