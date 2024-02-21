import { groupBy } from "lodash";

/** antv渐变转css渐变 */
export const toCSSGradient = (gradientColor: string) => {

  const regexLG = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i;
  const regexRG = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i;
  // eslint-disable-next-line no-useless-escape
  const regexColorStop = /[\d.]+:(#[^\s]+|[^\)]+\))/gi;

  const isGradientColor = (val: string) => /^[r,R,L,l]{1}[\s]*\(/.test(val);

  if (isGradientColor(gradientColor)) {
    let cssColor: string = '';
    let steps: string = '';
    if (gradientColor[0] === 'l') {
      // 线性渐变
      const arr = regexLG.exec(gradientColor)!;
      const angle = +arr[1] + 90; // css 和 g 的渐变起始角度不同
      steps = arr[2];

      cssColor = `linear-gradient(${angle}deg, `;
    } else if (gradientColor[0] === 'r') {
      // 径向渐变
      cssColor = 'radial-gradient(';
      const arr = regexRG.exec(gradientColor)!;
      steps = arr[4];
    }

    const colorStops: string[] = steps.match(regexColorStop)!;
    colorStops.forEach((item, index) => {
      const itemArr = item.split(':');
      // @ts-ignore
      cssColor += `${itemArr[1]} ${itemArr[0] * 100}%`;
      if (index !== (colorStops.length - 1)) {
        cssColor += ', ';
      }
    });

    cssColor += ')';

    return cssColor;
  }

  return gradientColor;
};

/**
 * 向数据中填充颜色字段并额外返回颜色对照表
 * @param data 原始数据
 * @param colorField 颜色映射对应的字段名
 * @param colorArray 颜色数组
 * @param fieldName 填充颜色的字段名 默认为color
 */
export const fillColor = (
  data: { [key: string]: any }[],
  colorField: string,
  colorArray: string[],
  fieldName: string = 'color',
) => {
  const groupData = groupBy(data, colorField);
  const keys = Object.keys(groupData);
  let processedData: { [key: string]: any }[] = [];
  const colorMap: { title: string; color: string }[] = [];
  keys.forEach((key, index) => {
    const group = groupData[key];
    const groupColor = colorArray[index % colorArray.length];
    colorMap.push({ title: key, color: groupColor });
    const processedGroupData = group.map((item) => {
      return {
        ...item,
        [fieldName]: groupColor,
      };
    });
    processedData = [...processedData, ...processedGroupData];
  });

  return { processedData, colorMap };
};
