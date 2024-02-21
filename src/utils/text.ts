/* eslint-disable @typescript-eslint/no-unused-expressions */
interface TextContainerStyleType {
  fontSize: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  whiteSpace?: string;
  wordBreak?: string;
  containerWidth?: string;
}

interface TextSizeType {
  width: number;
  height: number;
}

/** 计算文本尺寸 */
export const getTextSize = <T extends string | string[]>(
  text: T,
  style: TextContainerStyleType,
): T extends string ? TextSizeType : TextSizeType[] => {
  const { fontSize, fontWeight, fontFamily, lineHeight, whiteSpace, wordBreak, containerWidth } =
    style;
  const dom = document.createElement('span');
  dom.style.position = 'absolute';
  dom.style.top = '0';
  dom.style.left = '0';
  dom.style.display = 'inline-block';
  dom.style.zIndex = '99999';
  dom.style.fontSize = fontSize;
  fontWeight && (dom.style.fontWeight = fontWeight);
  fontFamily && (dom.style.fontFamily = fontFamily);
  lineHeight && (dom.style.lineHeight = lineHeight);
  whiteSpace && (dom.style.whiteSpace = whiteSpace);
  wordBreak && (dom.style.wordBreak = wordBreak);
  containerWidth && (dom.style.width = containerWidth);
  document.body.appendChild(dom);
  if (Array.isArray(text)) {
    const result = text.map((str) => {
      dom.textContent = str;
      const width = dom.clientWidth;
      const height = dom.clientHeight;
      return { width, height };
    });
    document.body.removeChild(dom);
    // @ts-ignore
    return result;
  } else {
    dom.textContent = text;
    const width = dom.clientWidth;
    const height = dom.clientHeight;
    document.body.removeChild(dom);
    // @ts-ignore
    return { width, height };
  }
};
