import React, { useRef } from 'react';
import Drawer from 'react-native-drawer';

export default function AppDrawer({ drawerContent, children }: any) {
  const drawerRef = useRef<any>(null);

  const openDrawer = () => {
    drawerRef.current?.open();
  };

  const closeDrawer = () => {
    drawerRef.current?.close();
  };

  return (
    <Drawer
      ref={drawerRef}
      type="displace"     // <-- pushes screen to right
      tapToClose={true}
      openDrawerOffset={0.3}   // 70% drawer width
      panCloseMask={0.3}
      panOpenMask={0.1}
      tweenDuration={250}
      content={drawerContent(closeDrawer)}
      styles={drawerStyles}
    >
      {/* children(openDrawer) gives HomeScreen access to openDrawer() */}
      {children(openDrawer)}
    </Drawer>
  );
}

const drawerStyles = {
  drawer: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
};
