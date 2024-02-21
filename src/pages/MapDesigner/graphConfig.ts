/**
 * 针对画布的配置
 *
 * 画布：https://x6.antv.antgroup.com/api/graph/graph
 * 对齐线：https://x6.antv.antgroup.com/tutorial/plugins/snapline
 * 框选：https://x6.antv.antgroup.com/tutorial/plugins/selection
 * 图形变换：https://x6.antv.antgroup.com/tutorial/plugins/transform
 * 快捷键：https://x6.antv.antgroup.com/tutorial/plugins/keyboard
 */

import { Graph } from "@antv/x6";
import { Snapline } from '@antv/x6-plugin-snapline';
import { Selection } from '@antv/x6-plugin-selection';
import { Transform } from '@antv/x6-plugin-transform';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { KeyboardImpl } from "@antv/x6-plugin-keyboard/lib/keyboard";
import { nodeMinSize } from "./config";
import { shapeResizable } from "./register";
import { isReadonlyCell } from "./utils";

type GraphOptions = ConstructorParameters<typeof Graph>[0];

type SnaplineOptions = Snapline.Options;

type SelectionOptions = Selection.Options;

type TransformOptions = Transform.Options;

type KeyboardOptions = KeyboardImpl.Options;

type CreateGraphOptions = {
  graph?: GraphOptions;
  snapline?: SnaplineOptions;
  selection?: SelectionOptions;
  transform?: TransformOptions;
  keyboard?: KeyboardOptions;
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
    modifiers: 'Ctrl',
  },
  interacting: cellView => {
    return !isReadonlyCell(cellView.cell);
  },
};

/** 对齐线设置 */
const snaplineConfig: SnaplineOptions = {
  enabled: true,
  // 对齐精度
  tolerance: 2,
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
  showNodeSelectionBox: true,
};

/** 图形变换设置 */
const transformConfig: TransformOptions = {
  // 调整尺寸
  resizing: {
    enabled: node => {
      const shape = node.shape;
      return !isReadonlyCell(node) && shapeResizable(shape);
    },
    minWidth: nodeMinSize.width,
    minHeight: nodeMinSize.height,
    // 不允许翻转
    allowReverse: false,
  },
  // 调整旋转角度
  rotating: false,
};

/** 快捷键设置 */
const keyboardConfig: KeyboardOptions = {
  enabled: true,
  global: true,
}

/** 创建Graph实例 */
export const createGraph = (options: CreateGraphOptions): Graph => {
  const { graph: graphOptions, snapline: snaplineOptions, selection: selectionOptions, transform: transformOptions, keyboard: keyboardOptions } = options;
  const graph = new Graph({
    ...graphConfig,
    ...graphOptions,
  });

  // 配置插件
  graph.use(new Snapline({
    ...snaplineConfig,
    ...snaplineOptions,
  }));
  graph.use(new Selection({
    ...selectionConfig,
    ...selectionOptions,
  }));
  graph.use(new Transform({
    ...transformConfig,
    ...transformOptions,
  }));
  graph.use(new Keyboard({
    ...keyboardConfig,
    ...keyboardOptions,
  }));

  return graph;
}
