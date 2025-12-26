import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { TEXT_STYLES } from '../utils/theme';

export const GradientButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '48%',
        height: 50,
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#592AC7" />
            <Stop offset="100%" stopColor="#CCB6FF" />
          </LinearGradient>
        </Defs>

        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="14"
          fill="url(#btnGrad)"
        />
      </Svg>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            ...TEXT_STYLES.title,
            color: '#FFF',
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
