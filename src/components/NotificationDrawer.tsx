import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75; // 50% of screen

export default function NotificationDrawer({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;

  // Slide in
  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [translateX, visible]);

  return (
    <>
      {/* Dim overlay */}
      {visible && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Right-side drawer */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: DRAWER_WIDTH,
          backgroundColor: '#fff',
          elevation: 15,
          transform: [{ translateX }],
        }}
      >
        {children}
      </Animated.View>
    </>
  );
}
