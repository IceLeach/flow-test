import React from 'react';
import { Graph, Node } from '@antv/x6';
import { ComponentConfigType, ComponentNodeData } from '../types';

type CustomNodeProperties<T> = Omit<Node.Properties, 'data'> & {
  data: ComponentNodeData<T>;
}

type CustomComponentProps<T> = {
  node: Node<CustomNodeProperties<T>>;
  graph: Graph;
}

/** 自定义组件类型 */
export type CustomComponent<T extends ComponentConfigType = ComponentConfigType> = React.ComponentType<CustomComponentProps<T>>;
