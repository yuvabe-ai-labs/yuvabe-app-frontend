declare module 'react-native-drawer' {
  import * as React from 'react';
  import { ViewStyle } from 'react-native';

  export interface DrawerProps {
    type?: 'overlay' | 'static' | 'displace';

    open?: boolean;

    openDrawerOffset?: number | (() => number);
    closedDrawerOffset?: number;

    panOpenMask?: number;
    panCloseMask?: number;

    captureGestures?: boolean | ('open' | 'closed');
    acceptTap?: boolean;
    acceptPan?: boolean;

    tweenDuration?: number;
    tapToClose?: boolean;

    content?: React.ReactNode;

    onOpen?: () => void;
    onClose?: () => void;

    styles?: {
      drawer?: ViewStyle;
      main?: ViewStyle;
    };

    disabled?: boolean;
    negotiatePan?: boolean;
    initializeOpen?: boolean;

    /** FIX: react-native-drawer actually supports children */
    children?: React.ReactNode;
  }

  export default class Drawer extends React.Component<DrawerProps> {}
}
