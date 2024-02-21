/** 原始容器 */
export type ContainerType = {
  type: 'room';
  width?: number;
  height?: number;
}

/** 组件业务属性 */
export type ComponentConfigType = Record<string, any>;

/** 组件资产属性 */
export type ComponentAssetType = {
  id: string;
  name: string;
}

/** 原始组件 */
export type ComponentType = {
  id?: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  angle?: number;
  config: ComponentConfigType;
  asset?: ComponentAssetType;
}

/** 原始数据 最终产物 */
export type MapType = {
  container: ContainerType;
  components: ComponentType[];
}

/** 组件节点的业务数据 内部类型 */
export type ComponentNodeData<T extends ComponentConfigType = ComponentConfigType> = {
  config: T;
  asset?: ComponentAssetType;
}

/** 组件节点 内部类型 */
export type ComponentNodeType<T extends ComponentConfigType = ComponentConfigType> = {
  id: string;
  shape: string;
  size: {
    width: number;
    height: number;
  };
  /** 左上角点坐标 */
  position: {
    x: number;
    y: number;
  };
  zIndex: number;
  /** 顺时针中心旋转的角度 */
  angle?: number;
  data: ComponentNodeData<T>;

  // 内部测试
  visible?: boolean;
}

/** 历史信息 */
export type HistoryType = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
