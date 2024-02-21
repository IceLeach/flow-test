import React from 'react';
import styles from './index.less';

type FormItemProps = {
  label?: string;
  component: React.ReactNode;
  /** 无样式 直接渲染component */
  noStyle?: boolean;
}

const FormItem: React.FC<FormItemProps> = (props) => {
  const { label, component, noStyle } = props;

  return noStyle ? component : (
    <div className={styles.formItem}>
      <div className={styles.label} title={label}>{label}</div>
      <div className={styles.component}>{component}</div>
    </div>
  );
}

export default FormItem;
