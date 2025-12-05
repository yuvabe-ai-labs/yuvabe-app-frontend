import { Plus } from 'lucide-react-native'; // optional icon package
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const prompts = ['Your own thoughts.', 'What’s on your mind right now?'];

const JournalingScreen = ({ navigation }: any) => {
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  // Placeholder list data for UI (replace with DB results)
  const entries = [
    // Example:
    { id: '1', title: 'My Day', date: 'Dec 5, 2025' },
  ];

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <Text className="text-3xl font-semibold text-gray-900 mb-4">Journal</Text>

      {/* Prompt */}
      <View className="bg-blue-50 rounded-2xl p-4 mb-5">
        <Text className="text-lg text-gray-800">{prompt}</Text>
      </View>

      {/* List of entries */}
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text className="text-gray-500 mt-10 text-center">
            No entries yet. Tap + to start writing.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-4 mb-3 border border-gray-200 rounded-xl"
            onPress={() =>
              navigation.navigate('CreateJournal', { id: item.id })
            }
          >
            <Text className="text-xl font-medium text-gray-900">
              {item.title}
            </Text>
            <Text className="text-gray-600 mt-1">{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('CreateJournal')}
      >
        <Plus size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default JournalingScreen;
