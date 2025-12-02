import React, { useRef, useState } from 'react';
import Drawer from 'react-native-drawer';

type AppDrawerProps = {
  drawerContent: (closeDrawer: () => void) => React.ReactNode;
  children: (openDrawer: () => void, isDrawerOpen: boolean) => React.ReactNode;
};

export default function AppDrawer({ drawerContent, children }: AppDrawerProps) {
  const drawerRef = useRef<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    drawerRef.current?.open();
  };

  const closeDrawer = () => {
    drawerRef.current?.close();
  };

  return (
    <Drawer
      ref={drawerRef}
      type="displace" // pushes screen to right
      tapToClose={true}
      openDrawerOffset={0.3} // 70% main visible
      panCloseMask={0.3}
      panOpenMask={0.1}
      tweenDuration={250}
      content={drawerContent(closeDrawer)}
      styles={drawerStyles}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
    >
      {children(openDrawer, isDrawerOpen)}
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
