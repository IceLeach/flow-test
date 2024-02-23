import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Spin } from 'antd';
import MapViewer from '@/components/configurationMap/MapViewer';
import { PlanModeItemStatus } from '@/components/configurationMap/MapViewer/types';
import { createPopover, removePopover } from './Popover';
import styles from './index.less';

interface MapContainerProps {
  roomId: number;
  jumpToEquip: (key: string, callBack?: () => void) => void;
}

let c: boolean = false;
const cmdbBizScreenRackRateGet = async (data: { roomId: number }) => {
  c = !c;
  return {
    roomId: data.roomId,
    data: {
      rackList: c ? [
        { id: 1, maxRate: 10 },
        { id: 2, maxRate: 30 },
        { id: 3, maxRate: 50 },
      ] : [
        { id: 1, maxRate: 50 },
        { id: 2, maxRate: 70 },
        { id: 3, maxRate: 90 },
      ],
    },
  }
}

const MapContainer: React.FC<MapContainerProps> = (props) => {
  const { roomId, jumpToEquip } = props;
  const [status, setStatus] = useState<'loading' | 'finished' | 'error'>('finished');
  const [viewerStatus, setViewerStatus] = useState<'loading' | 'finished' | 'error'>('finished');
  const [assetStatusMap, setAssetStatusMap] = useState<Record<string, PlanModeItemStatus>>({});
  const intervalRef = useRef<NodeJS.Timeout>();
  const mapItemsRef = useRef<any[]>([]);
  const popoverRef = useRef(null);

  const isLoading = useMemo(() => status === 'loading' || viewerStatus === 'loading', [status, viewerStatus]);
  const isError = useMemo(() => status === 'error' || viewerStatus === 'error', [status, viewerStatus]);

  useEffect(() => {
    setStatus('loading');
    clearInterval(intervalRef.current);
    const getMapModeData = () => {
      const rateToStatus = (rateU: number) => {
        if (rateU > 80) {
          return 'HH';
        } else if (rateU >= 60) {
          return 'H';
        } else if (rateU >= 40) {
          return 'M';
        } else if (rateU >= 20) {
          return 'L';
        } else {
          return 'LL';
        }
      };
      cmdbBizScreenRackRateGet({ roomId }).then((itemRes) => {
        // console.log('res', itemRes)
        const rackList = itemRes.data.rackList ?? [];
        mapItemsRef.current = rackList;
        const statusMap: Record<string, PlanModeItemStatus> = {};
        rackList.forEach(d => {
          statusMap[`${d.id}_2`] = rateToStatus(d.maxRate);
        });
        setAssetStatusMap(statusMap);
      });
    };
    getMapModeData();
    intervalRef.current = setInterval(getMapModeData, 60 * 1000);
    setStatus('finished');
  }, [roomId]);

  const onAssetNodeMouseEnter = (asset: { id: string, name: string }, e: MouseEvent) => {
    const arr = asset.id.split('_');
    const id = parseInt(arr[0]);
    const currentItem = mapItemsRef.current.find((d) => d.id === id);
    if (currentItem && popoverRef.current) {
      createPopover(
        {
          left: e.clientX,
          top: e.clientY,
          style: {
            width: 'fit-content',
            height: 'auto',
            padding: '12px 48px 12px 24px',
            backgroundColor: '#fff',
            boxShadow: '0 9px 28px 8px rgba(0, 0, 0, 5%), 0 6px 16px 0px rgba(0, 0, 0, 8%), 0 3px 6px -4px rgba(0, 0, 0, 12%)',
          },
          content: (
            <div className={styles.situationContent}>
              <div className={styles.contentItem} style={{ fontWeight: 'bold' }}>{asset.name}</div>
              <div className={styles.contentItem}>
                负载功率：
                {typeof currentItem.pload === 'number'
                  ? `${currentItem.pload}W`
                  : ''}
              </div>
              <div className={styles.contentItem}>
                当前功率：
                {typeof currentItem.usedPload === 'number'
                  ? `${currentItem.usedPload}W`
                  : ''}
              </div>
              <div className={styles.contentItem}>
                设备数量：{currentItem.equNum ?? ''}
              </div>
              <div className={styles.contentItem}>
                U位数：
                {typeof currentItem.totalU === 'number'
                  ? `${currentItem.usedU ?? ''}/${currentItem.totalU}`
                  : ''}
              </div>
              <div className={styles.contentItem}>
                光纤端口：
                {typeof currentItem.totalFiberPort === 'number'
                  ? `${currentItem.usedFiberPort ?? ''}/${currentItem.totalFiberPort
                  }`
                  : ''}
              </div>
              <div className={styles.contentItem}>
                网络端口：
                {typeof currentItem.totalNetPort === 'number'
                  ? `${currentItem.usedNetPort ?? ''}/${currentItem.totalNetPort}`
                  : ''}
              </div>
            </div>
          ),
        },
        popoverRef.current,
      );
    } else if (asset.name && popoverRef.current) {
      createPopover(
        {
          left: e.clientX,
          top: e.clientY,
          // left: e.originalEvent.layerX,
          // top: e.originalEvent.layerY + 40,
          style: {
            width: 'fit-content',
            whiteSpace: 'nowrap',
            height: 'auto',
            backgroundColor: '#fff',
          },
          content: <div>{asset.name}</div>,
        },
        popoverRef.current,
      );
    }
  }

  return !isError ? (
    <div className={styles.mapContainer}>
      <div className={styles.fastSearch}></div>
      <div ref={popoverRef} />
      <div className={styles.viewer}>
        <MapViewer
          roomId={roomId}
          onStatusChange={status => setViewerStatus(status)}
          mode={{ type: 'plan', data: assetStatusMap }}
          onAssetNodeMouseEnter={onAssetNodeMouseEnter}
          onAssetNodeMouseLeave={() => {
            removePopover();
          }}
          onAssetNodeDoubleClick={(asset) => {
            // console.log('dbclick', asset);
            jumpToEquip(asset.id, removePopover);
          }}
        />
      </div>
      <div className={styles.mapBottom}></div>
      {isLoading && (<Spin className={styles.loading} />)}
    </div>
  ) : '暂无数据';
}

export default MapContainer;
