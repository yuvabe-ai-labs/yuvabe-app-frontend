import { useIsFocused } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAllJournals } from '../../api/journal-api/journalApi';
import { TEXT_STYLES } from '../../utils/theme';

const JournalingScreen = ({ navigation }: any) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const data = await getAllJournals();
      setEntries(data);
    } catch (err) {
      console.log('Error fetching journals:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJournals();
    setRefreshing(false);
  };

  useEffect(() => {
    if (isFocused) fetchJournals();
  }, [isFocused]);

  const hasEntries = entries.length > 0;

  return (
    <View className="flex-1 bg-[#FFFFFF] pt-4 px-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-7 justify-center"
        >
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>

        <Text
          style={{
            ...TEXT_STYLES.title,
            fontSize: 18,
            fontWeight: '600',
          }}
          className="flex-1 text-center text-[#111827]"
        >
          Journal
        </Text>

        <View className="w-7" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : hasEntries ? (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 50 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 mb-3 border border-[#592AC7] rounded-xl flex-row items-center justify-between"
              onPress={() =>
                navigation.navigate('CreateJournal', { id: item.id })
              }
            >
              {/* Left side: title + date */}
              <View className="flex-1">
                <Text className="text-xl font-medium text-[#111827]">
                  {item.title}
                </Text>
                <Text className="text-[#6B7280] mt-1">
                  {new Date(item.journal_date).toDateString()}
                </Text>
              </View>

              {/* Right chevron */}
              <ChevronRight
                size={24}
                color="black"
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-xl font-semibold text-[#374151] text-center mb-2 opacity-90">
            Today is yours. What do you want to say about it?
          </Text>

          <Text className="text-[15px] text-[#6B7280] text-center opacity-80 leading-6">
            Start by writing your first journal entry.
          </Text>
        </View>
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#5829c7] w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('CreateJournal')}
      >
        <Plus size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default JournalingScreen;
