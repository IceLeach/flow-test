import React from 'react';
import { ColorPicker, ColorPickerProps } from 'antd';
import styles from './index.less';

type HexColorPickerProps = Omit<ColorPickerProps, 'value' | 'onChange'> & {
  value?: string;
  onChange?: (value: string) => void;
};

const HexColorPicker: React.FC<HexColorPickerProps> = (props) => {
  const { value, onChange, ...restProps } = props;

  return (
    <ColorPicker
      className={styles.hexColorPicker}
      showText
      disabledAlpha
      {...restProps}
      value={value}
      onChangeComplete={(value) => {
        if (onChange) {
          onChange(value.toHexString())
        }
      }}
    />
  );
}

export default HexColorPicker;
