import { Tree } from 'antd';
import type { EventDataNode } from 'antd/lib/tree';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import SearchInput from '../SearchInput';
import styles from './index.less';

interface SearchTreeNode {
  key: string | number;
  title: React.ReactNode;
  /** 名称，用于搜索 */
  name: string;
  /** 是否隐藏 */
  hidden?: boolean;
  disabled?: boolean;
  checkable?: boolean;
  disableCheckbox?: boolean;
  icon?: React.ReactNode;
  iconColor?: (active: boolean) => string;
  isLeaf?: boolean;
  selectable?: boolean;
  switcherIcon?: React.ReactNode;
  [key: string]: any;
  children?: SearchTreeNode[];
}

interface SearchTreeProps {
  treeData: SearchTreeNode[];
  loadData?: (treeNode: any) => Promise<any>;
  loadedKeys?: string[];
  activeKey?: (string | number)[];
  onNodeClick?: (nodeData: any) => void;
  onNodeDoubleClick?: (nodeData: any) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  expandedKeys?: React.Key[];
  onExpand?: (
    expandedKeys: React.Key[],
    info: {
      node: EventDataNode<any>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    },
  ) => void;
  checkable?: boolean;
  checkedKeys?: React.Key[];
  onCheck?: (
    checked:
      | {
        checked: React.Key[];
        halfChecked: React.Key[];
      }
      | React.Key[],
    info: any,
  ) => void;
  showSearchInput?: boolean;
}

const loop = (data: SearchTreeNode[], searchValue: string): SearchTreeNode[] => {
  // console.log('loop', data, searchValue);
  return data
    .map((item) => ({ ...item }))
    .filter((filterItem) => {
      filterItem.children = filterItem.children && loop(filterItem.children, searchValue);
      let flag = false;
      // 只对name做搜索
      if (filterItem.name) {
        flag = filterItem.name.indexOf(searchValue) !== -1;
      }
      return flag || !!(filterItem.children && filterItem.children.length);
    });
};

const clearHidden = (data: SearchTreeNode[]) => {
  return data
    .map((item) => ({ ...item }))
    .filter((filterItem) => {
      filterItem.children = filterItem.children && clearHidden(filterItem.children);
      return !filterItem.hidden;
    });
};

const SearchTree: React.FC<SearchTreeProps> = (props) => {
  const {
    treeData,
    activeKey = [],
    onNodeClick,
    onNodeDoubleClick,
    placeholder,
    className,
    style,
    showSearchInput = true,
    ...restProps
  } = props;
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  const filterTreeData = useMemo(() => {
    if (searchValue) {
      const tranferTreeData = loop(treeData, searchValue);
      return tranferTreeData;
    } else {
      return treeData;
    }
  }, [searchValue, treeData]);
  const treeActiveKey = useMemo(() => activeKey, [activeKey]);

  return (
    <div
      className={className ? `${styles.searchTree} ${className}` : styles.searchTree}
      style={style}
    >
      <SearchInput
        value={inputValue}
        placeholder={placeholder}
        className={styles.searchInput}
        style={{ display: showSearchInput ? 'inline-flex' : 'none' }}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onSearch={(value) => {
          setSearchValue(value);
        }}
        allowClear
      />
      <Tree
        defaultExpandAll
        treeData={clearHidden(filterTreeData)}
        selectedKeys={treeActiveKey}
        titleRender={(nodeData) => {
          const isActive = treeActiveKey.includes(nodeData.key);
          return (
            <div
              className={classNames([styles.treeNodeContent, isActive ? styles.activeNode : ''])}
              title={typeof nodeData.title === 'string' ? nodeData.title : nodeData.name}
              onClick={() => !nodeData.disabled && onNodeClick && onNodeClick(nodeData)}
              onDoubleClick={() => onNodeDoubleClick && onNodeDoubleClick(nodeData)}
            >
              {nodeData.icon ? (
                <div className={styles.icon} style={{ ...nodeData.iconColor ? { color: nodeData.iconColor(isActive) } : {} }}>{nodeData.icon}</div>
              ) : ''}
              <div className={styles.title}>{nodeData.title}</div>
            </div>
          );
        }}
        // selectable={false}
        {...restProps}
      />
    </div>
  );
};

export default SearchTree;
