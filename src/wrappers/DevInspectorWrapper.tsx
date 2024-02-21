import React from 'react';
import { Inspector } from 'react-dev-inspector';

const InspectorWrapper = REACT_APP_ENV !== 'pre' ? Inspector : React.Fragment;

const DevInspectorWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <InspectorWrapper keys={['control', 'shift', 'q']}>{children}</InspectorWrapper>;
};

export default DevInspectorWrapper;
