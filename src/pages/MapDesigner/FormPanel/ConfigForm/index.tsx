import React from 'react';
import { Space } from 'antd';
import { FormItemOptions } from '../config';
import FormItem from './FormItem';

type ConfigFormProps = {
  items: FormItemOptions[];
}

const ConfigForm: React.FC<ConfigFormProps> = (props) => {
  const { items } = props;

  return (
    <Space direction='vertical' size={16} style={{ width: '100%' }}>
      {items.map((d, index) => (
        <FormItem
          key={index}
          label={d.label}
          component={d.component}
          noStyle={d.noStyle}
        />
      ))}
    </Space>
  );
}

export default ConfigForm;
