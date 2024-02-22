import React, { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import SearchTree from '@/components/SearchTree';
import { equIconList } from '@/pages/asset/Classification/config';
import MapDesigner from '../MapDesigner';
import styles from './index.less';
import { Spin } from 'antd';

type TreeAssetType = {
  type: 'asset';
  key: string;
  parentKey: number;
  title: string;
  name: string;
  icon: React.ReactNode;
}

type TreeRoomType = {
  type: 'room';
  key: number;
  title: string;
  name: string;
  icon: React.ReactNode;
  children?: TreeAssetType[];
}

const getTree = async () => ({
  data: [
    {
      id: 1,
      name: '机房1',
      children: [
        { id: 1, name: 'A011', type: '2', icon: 'STORE' },
        { id: 2, name: 'A022', type: '2', icon: 'NET' },
      ],
    },
    {
      id: 2,
      name: '机房2',
      children: [
        { id: 22, name: 'A222', type: '2', icon: 'STORE' },
      ],
    },
  ],
})

const Configuration: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'finished' | 'error'>('finished');
  const [treeData, setTreeData] = useState<TreeRoomType[]>([]);
  const [activeNode, setActiveNode] = useState<TreeRoomType | TreeAssetType>();
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
  const dndRef = useRef<HTMLDivElement>(null);
  const [designerStatus, setDesignerStatus] = useState<'loading' | 'finished' | 'error'>('finished');

  const isLoading = useMemo(() => status === 'loading' || designerStatus === 'loading', [status, designerStatus]);
  const isError = useMemo(() => status === 'error' || designerStatus === 'error', [status, designerStatus]);

  useEffect(() => {
    setStatus('loading');
    getTree().then(res => {
      const tree: TreeRoomType[] = res.data.map(d => ({
        type: 'room',
        key: d.id,
        title: d.name,
        name: d.name,
        icon: <Icon type="icon-jifang" />,
        children: d.children.map(item => ({
          type: 'asset',
          key: `${item.id}_${item.type}`,
          parentKey: d.id,
          title: item.name,
          name: item.name,
          icon: equIconList.find((d) => d.type === item.icon)?.icon,
        })),
      }));
      setTreeData(tree);
      if (tree?.length) {
        setActiveNode(tree[0]);
      }
      setStatus('finished');
    }).catch(() => setStatus('error'));
  }, []);

  const onTreeNodeClick = (nodeData: TreeRoomType | TreeAssetType) => {
    setActiveNode(nodeData);
  }

  return (
    <div className={styles.configuration}>
      {!isError ? (
        <>
          <div className={styles.leftBar}>
            <div className={styles.tree}>
              <SearchTree
                treeData={treeData}
                onNodeClick={onTreeNodeClick}
                activeKey={activeNode ? [activeNode.key] : []}
                placeholder="请输入"
                expandedKeys={expandedKeys}
                onExpand={(keys) => setExpandedKeys(keys as (string | number)[])}
              />
            </div>
            <div ref={dndRef} className={styles.dndContainer} />
          </div>
          <div className={styles.main}>
            {!!activeNode && (
              <MapDesigner
                roomId={activeNode.type === 'room' ? activeNode.key : activeNode.parentKey}
                dndPanelContainerRef={dndRef}
                onStatusChange={status => setDesignerStatus(status)}
                highlightAsset={activeNode.type === 'asset' ? activeNode.key : undefined}
                getRoomAssetsName={roomId => {
                  const roomNode = treeData.find(d => d.key === roomId);
                  if (!roomNode) return {};
                  const nameMap: Record<string, string> = {};
                  roomNode.children?.forEach(d => {
                    nameMap[d.key] = d.name;
                  });
                  return nameMap;
                }}
              />
            )}
          </div>
          {isLoading && (<Spin className={styles.loading} />)}
        </>
      ) : (
        <div>发生了错误</div>
      )}
    </div>
  );
}

export default Configuration;
