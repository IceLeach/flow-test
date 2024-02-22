import React from 'react';
import { Outlet } from 'umi';
import { App, ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import zhCN from 'antd/es/locale/zh_CN';
import { MessageInstance } from 'antd/es/message/interface';
import { NotificationInstance } from 'antd/es/notification/interface';
import { ModalStaticFunctions } from 'antd/es/modal/confirm';
import DevInspectorWrapper from '@/wrappers/DevInspectorWrapper';
import theme from './theme';

// 对静态方法做处理以使用主题配置
let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

const StaticFunctionHolder: React.FC = () => {
  const staticFunction = App.useApp();
  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;

  return (
    <></>
  );
}

const GlobalLayout: React.FC = () => {
  return (
    <>
      <StyleProvider hashPriority='high'>
        <ConfigProvider
          locale={zhCN}
          autoInsertSpaceInButton={false}
          input={{
            autoComplete: 'off',
          }}
          theme={theme}
        >
          <App style={{ height: '100%' }}>
            <StaticFunctionHolder />
            <DevInspectorWrapper>
              <Outlet />
            </DevInspectorWrapper>
          </App>
        </ConfigProvider>
      </StyleProvider>
    </>
  )
}

export default GlobalLayout;

export { message, notification, modal };
