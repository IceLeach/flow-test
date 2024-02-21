import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';

type SizeInputNumberProps = Omit<InputNumberProps<number>, 'addonAfter'>;

const SizeInputNumber: React.FC<SizeInputNumberProps> = (props) => {
  return (
    <InputNumber
      {...props}
      addonAfter='cm'
    />
  );
}

export default SizeInputNumber;
