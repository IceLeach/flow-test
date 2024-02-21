/**
 * 使用方式参考https://ant.design/components/icon-cn/#components-icon-demo-iconfont
 * 当前图标库地址https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=4086816
 * 由于部署环境可能无法连接外网，需要使用本地导入 拷贝SVG Symbol生成的文件
 */

import { createFromIconfontCN } from '@ant-design/icons';

/** 使用SVG Symbol */
const Icon = createFromIconfontCN({
  scriptUrl: [require('@/assets/iconfont.js')],
});

export default Icon;
