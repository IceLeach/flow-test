import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App, Spin } from 'antd';
import Icon from '@/components/Icon';
import SearchTree from '@/components/SearchTree';
import { equIconList } from '@/pages/asset/Classification/config';
import MapDesigner, { SaveOptions } from '../MapDesigner';
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

type SaveType = {
  roomId: number;
  jsonData: string;
  alreadyList: {
    id: number;
    type: string;
    locateX: string;
    locateY: string;
  }[];
  waitList: {
    id: number;
    type: string;
  }[];
}
const save = async (d: SaveType) => ({ d })

const formatTreeData = (data: any[]): TreeRoomType[] => {
  return data.map(d => ({
    type: 'room',
    key: d.id,
    title: d.name,
    name: d.name,
    icon: <Icon type="icon-jifang" />,
    children: d.children.map((item: any) => ({
      type: 'asset',
      key: `${item.id}_${item.type}`,
      parentKey: d.id,
      title: item.name,
      name: item.name,
      icon: equIconList.find((d) => d.type === item.icon)?.icon,
    })),
  }));
}

const Configuration: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'finished' | 'error'>('finished');
  const [treeData, setTreeData] = useState<TreeRoomType[]>([]);
  const [activeNode, setActiveNode] = useState<TreeRoomType | TreeAssetType>();
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
  const [designerStatus, setDesignerStatus] = useState<'loading' | 'finished' | 'error'>('finished');
  const dndRef = useRef<HTMLDivElement>(null);
  const { message } = App.useApp();

  const isLoading = useMemo(() => status === 'loading' || designerStatus === 'loading', [status, designerStatus]);
  const isError = useMemo(() => status === 'error' || designerStatus === 'error', [status, designerStatus]);

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

  const reloadTree = () => {
    setStatus('loading');
    getTree().then(res => {
      const tree = formatTreeData(res.data);
      setTreeData(tree);
      if (!tree?.length) {
        setActiveNode(undefined);
      } else if (activeNode?.type === 'asset') {
        const parentKey = activeNode.parentKey;
        const parentNode = tree.find(d => d.key === parentKey);
        if (!parentNode) {
          setActiveNode(tree[0]);
        }
        const assetNode = parentNode?.children?.find(d => d.key === activeNode.key);
        if (!assetNode) {
          setActiveNode(parentNode);
        }
      } else if (activeNode?.type === 'room') {
        const roomNode = tree.find(d => d.key === activeNode.key);
        if (!roomNode) {
          setActiveNode(tree[0]);
        }
      } else {
        setActiveNode(tree[0]);
      }
      setStatus('finished');
    }).catch(() => setStatus('error'));
  }

  const onSave = ({ roomId, data, assets }: SaveOptions) => {
    save({
      roomId,
      jsonData: data,
      alreadyList: assets.filter(d => d.used).map(d => {
        const idType = d.id.split('_');
        return {
          id: Number(idType[0]),
          type: idType[1],
          locateX: `${d.x!}`,
          locateY: `${d.y!}`,
        };
      }),
      waitList: assets.filter(d => !d.used).map(d => {
        const idType = d.id.split('_');
        return {
          id: Number(idType[0]),
          type: idType[1],
        };
      }),
    }).then(() => {
      message.success('保存成功');
      reloadTree();
    });
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
                onSave={onSave}
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
