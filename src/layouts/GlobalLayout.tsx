import React from 'react';
import { Outlet } from 'umi';
import { StyleProvider } from '@ant-design/cssinjs';
import DevInspectorWrapper from '@/wrappers/DevInspectorWrapper';

const GlobalLayout: React.FC = () => {
  return (
    <>
      <StyleProvider hashPriority='high'>
        <DevInspectorWrapper>
          <Outlet />
        </DevInspectorWrapper>
      </StyleProvider>
    </>
  )
}

export default GlobalLayout;
