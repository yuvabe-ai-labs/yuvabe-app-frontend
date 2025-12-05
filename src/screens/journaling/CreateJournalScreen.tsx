import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const CreateJournalScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const today = new Date().toDateString();

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <Text className="text-2xl font-semibold text-gray-900 mb-4">
        New Journal Entry
      </Text>

      {/* Title Input */}
      <Text className="text-gray-700 mb-2">Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Entry title..."
        className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-5"
      />

      {/* Date */}
      <Text className="text-gray-700 mb-2">Date</Text>
      <View className="border border-gray-300 rounded-xl px-4 py-3 mb-6">
        <Text className="text-gray-800">{today}</Text>
      </View>

      {/* Multiline text editor */}
      <Text className="text-gray-700 mb-2">Your Thoughts</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Start writing..."
        multiline
        textAlignVertical="top"
        className="flex-1 border border-gray-300 rounded-2xl p-4 text-base text-gray-900"
      />

      {/* Save Button */}
      <TouchableOpacity
        className="bg-blue-600 py-3 rounded-xl items-center mt-4"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white text-lg font-medium">Save Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateJournalScreen;
