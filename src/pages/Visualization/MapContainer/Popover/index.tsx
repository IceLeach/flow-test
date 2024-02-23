import React, { useEffect, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import styles from './index.less';

export interface PopoverProps {
  left: number;
  top: number;
  content: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

let root: Root | undefined;

const Popover: React.FC<PopoverProps> = (props) => {
  const { left, top, content, className, style } = props;
  const [popoverLeft, setPopoverLeft] = useState<number>(left);
  const [popoverTop, setPopoverTop] = useState<number>(top);
  const [isOk, setIsOk] = useState<boolean>(false);
  const bodyWidth = document.body.clientWidth;
  const bodyHeight = document.body.clientHeight;

  useEffect(() => {
    const popover = document.getElementById('popover');
    if (popover) {
      const x = popover.getBoundingClientRect().left;
      const y = popover.getBoundingClientRect().top;
      const width = popover.clientWidth;
      const height = popover.clientHeight;
      // console.log('popover', x, y, width, height, bodyWidth, bodyHeight)
      if (x + width > bodyWidth) {
        setPopoverLeft(bodyWidth - width - (x - left));
      }
      if (y + height > bodyHeight) {
        setPopoverTop(bodyHeight - height - (y - top));
      }
      setIsOk(true);
      // console.log('d', left, top, popoverLeft, popoverTop)
    }
  }, [document.getElementById('popover')]);

  return (
    <>
      <div
        id="popover"
        className={`${styles.popover}${className ? ` ${className}` : ''}`}
        style={{
          left: popoverLeft,
          top: popoverTop,
          display: isOk ? 'block' : 'none',
          ...style,
        }}
      >
        {content}
      </div>
    </>
  );
};

export const createPopover = (props: PopoverProps, popupContainer: HTMLElement) => {
  const popover = <Popover {...props} />;
  root = createRoot(popupContainer);
  root.render(popover);
};

export const removePopover = () => {
  root?.unmount();
};

export default React.memo(Popover);
