import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Spin } from 'antd';
import Icon from '@/components/Icon';
import SearchTree from '@/components/SearchTree';
import { equIconList } from '../asset/Classification/config';
import MapContainer from './MapContainer';
import styles from './index.less';

type TreeAssetType = {
  type: 'asset';
  key: string;
  parentKey: number;
  title: string;
  name: string;
  icon: React.ReactNode;
}

type TreeRoomType = {
  type: 'room' | 'store';
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
      type: '1',
      children: [
        { id: 1, name: 'A011', type: '2', icon: 'STORE' },
        { id: 2, name: 'A022', type: '2', icon: 'NET' },
      ],
    },
    {
      id: 2,
      name: '机房2',
      type: '1',
      children: [
        { id: 22, name: 'A222', type: '2', icon: 'STORE' },
      ],
    },
    {
      id: 3,
      name: '库房',
      type: '2',
    },
  ],
})

const formatTreeData = (data: any[]): TreeRoomType[] => {
  return data.map(d => ({
    type: d.type === '1' ? 'room' : 'store',
    key: d.id,
    title: d.name,
    name: d.name,
    icon: <Icon type="icon-jifang" />,
    children: d.children?.map((item: any) => ({
      type: 'asset',
      key: `${item.id}_${item.type}`,
      parentKey: d.id,
      title: item.name,
      name: item.name,
      icon: equIconList.find((d) => d.type === item.icon)?.icon,
    })),
  }));
}

const Visualization: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'finished' | 'error'>('finished');
  const [treeData, setTreeData] = useState<TreeRoomType[]>([]);
  const [activeNode, setActiveNode] = useState<TreeRoomType | TreeAssetType>();
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
  const treeDataRef = useRef<TreeRoomType[]>([]);

  treeDataRef.current = treeData;

  const isLoading = useMemo(() => status === 'loading', [status]);
  const isError = useMemo(() => status === 'error', [status]);

  const jumpToEquip = (key: string, callBack?: () => void) => {
    const node = treeDataRef.current.find(d => d.children?.find(d => d.key === key))?.children?.find(d => d.key === key);
    if (node) {
      setActiveNode(node);
      if (node.parentKey && !expandedKeys.includes(node.key)) {
        setExpandedKeys((keys) => [...keys, node.parentKey]);
      }
      if (callBack) {
        callBack();
      }
    }
  }

  const viewer = useMemo(() => {
    return activeNode?.type === 'room' ? (
      <MapContainer roomId={activeNode.key} jumpToEquip={jumpToEquip} />
    ) : activeNode?.type === 'asset' ? (
      <></>
    ) : activeNode?.type === 'store' ? (
      <></>
    ) : '';
  }, [activeNode]);

  useEffect(() => {
    setStatus('loading');
    getTree().then(res => {
      const tree = formatTreeData(res.data);
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
    <div className={styles.visualization}>
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
          </div>
          <div className={styles.main}>{viewer}</div>
          {isLoading && (<Spin className={styles.loading} />)}
        </>
      ) : (
        <div>发生了错误</div>
      )}
    </div>
  );
}

export default Visualization;
