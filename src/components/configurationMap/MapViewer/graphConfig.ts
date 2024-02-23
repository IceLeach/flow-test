/**
 * 针对画布的配置
 *
 * 画布：https://x6.antv.antgroup.com/api/graph/graph
 * 框选：https://x6.antv.antgroup.com/tutorial/plugins/selection
 */

import { Graph } from "@antv/x6";
import { Selection } from '@antv/x6-plugin-selection';
import { isReadonlyCell } from "./utils";

type GraphOptions = ConstructorParameters<typeof Graph>[0];

type SelectionOptions = Selection.Options;

type CreateGraphOptions = {
  graph?: GraphOptions;
  selection?: SelectionOptions;
}

/** 画布设置 */
const graphConfig: Omit<GraphOptions, 'container'> = {
  async: false,
  // 自动更新画布大小
  autoResize: true,
  // 画布背景
  background: {
    color: 'transparent',
  },
  // 网格背景
  grid: {
    visible: false,
    size: 2,
  },
  // 允许画布拖拽平移
  panning: true,
  // 鼠标滚轮缩放
  mousewheel: {
    enabled: true,
    // modifiers: 'Ctrl',
  },
  interacting: () => {
    return false;
  },
};

/** 框选设置 */
const selectionConfig: SelectionOptions = {
  enabled: true,
  filter: (cell) => {
    return !isReadonlyCell(cell);
  },
  // 禁用多选
  multiple: false,
  // 禁用框选
  rubberband: false,
  // 不显示选中框
  showNodeSelectionBox: false,
};

/** 创建Graph实例 */
export const createGraph = (options: CreateGraphOptions): Graph => {
  const { graph: graphOptions, selection: selectionOptions } = options;
  const graph = new Graph({
    ...graphConfig,
    ...graphOptions,
  });

  // 配置插件
  graph.use(new Selection({
    ...selectionConfig,
    ...selectionOptions,
  }));

  return graph;
}
