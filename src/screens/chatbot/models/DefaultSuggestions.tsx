import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const suggestions = [
  "What is Yuvabe?",
  "Can you tell me about Yuvabe's Core Principles?",
  "What about leave policy in Yuvabe!",
  "How many hours should I work on weekends?"
];

export default function DefaultSuggestions({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
      <Text style={{ fontSize: 14, color: '#444', marginBottom: 8 }}>
        Suggestions
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {suggestions.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={{
              backgroundColor: '#f2f2f2',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20
            }}
            onPress={() => onSelect(s)}
          >
            <Text style={{ color: '#333', fontSize: 13 }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
