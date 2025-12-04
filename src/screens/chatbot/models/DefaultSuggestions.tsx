import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const suggestions = [
  'What is Yuvabe?',
  "Can you tell me about Yuvabe's Core Principles?",
  'What about leave policy in Yuvabe!',
  'How many hours should I work on weekends?',
];

export default function DefaultSuggestions({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
      }}
    >
      <View style={{ marginTop: 300 }}>
        <Text
          style={{
            fontSize: 18,
            color: '#222',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Hey, I’m your Yuvabe Assistant!{'\n'}What would you like to know?
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        {suggestions.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={{
              backgroundColor: '#e5e5e5',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 20,
              margin: 5,
            }}
            onPress={() => onSelect(s)}
          >
            <Text style={{ color: '#333', fontSize: 14 }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
