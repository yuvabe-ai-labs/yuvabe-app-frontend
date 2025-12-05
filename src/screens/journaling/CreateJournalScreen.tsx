import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronLeft, Save, Pencil, Trash } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {
  createOrUpdateJournal,
  deleteJournal,
  getJournalById,
  updateJournal,
} from '../../api/journal-api/journalApi';

import { useAlertStore } from '../../store/useAlertStore';
import { useLoadingStore } from '../../store/useLoadingStore';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CreateJournalScreen = ({ navigation, route }: any) => {
  const journalId = route.params?.id || null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(journalId ? true : false);
  const [isEditing, setIsEditing] = useState(journalId ? false : true);

  const { showAlert, hideAlert } = useAlertStore.getState();
  const { showLoading, hideLoading } = useLoadingStore.getState();

  const [journalDateISO, setJournalDateISO] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const displayDate = new Date(journalDateISO).toDateString();

  useEffect(() => {
    if (!journalId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const data = await getJournalById(journalId);
        setTitle(data.title);
        setContent(data.content);

        if (data.journal_date) {
          setJournalDateISO(data.journal_date);
        }
      } catch (err) {
        showAlert({
          title: 'Error',
          message: `Could not load journal entry: ${err}`,
          confirmText: 'OK',
          onConfirm: () => hideAlert(),
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [journalId, hideAlert, showAlert]);

  const runFade = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    runFade();
    setIsEditing(prev => !prev);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      return showAlert({
        title: 'Invalid Entry',
        message: 'Title and content cannot be empty.',
        confirmText: 'OK',
        onConfirm: () => hideAlert(),
      });
    }

    showLoading('journalSave', 'Saving your journal...');

    try {
      if (journalId) {
        await updateJournal(journalId, {
          title,
          content,
          journal_date: journalDateISO,
        });
      } else {
        await createOrUpdateJournal({
          title,
          content,
          journal_date: journalDateISO,
        });
      }

      toggleEdit();
    } catch (err) {
      showAlert({
        title: 'Error Saving',
        message: `Failed to save journal entry:${err}`,
        confirmText: 'OK',
        onConfirm: () => hideAlert(),
      });
    } finally {
      hideLoading();
    }
  };

  const handleDelete = () => {
    if (!journalId) return;

    showAlert({
      title: 'Delete Entry',
      message: 'Are you sure you want to delete this journal entry?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,

      onConfirm: async () => {
        hideAlert();
        showLoading('journalDelete', 'Deleting entry...');

        try {
          await deleteJournal(journalId);
          navigation.goBack();
        } catch (err) {
          hideLoading();
          return showAlert({
            title: 'Error',
            message: `Failed to delete journal entry:${err}`,
            confirmText: 'OK',
            onConfirm: () => hideAlert(),
          });
        }

        hideLoading();
      },

      onCancel: () => hideAlert(),
    });
  };
  const onDateChange = (_event: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setJournalDateISO(selected.toISOString().split('T')[0]);
    }
  };

  const applyFormat = (type: 'bold' | 'italic' | 'heading' | 'bullet') => {
    setContent(prev => {
      const prefix = prev.endsWith('\n') || prev.length === 0 ? '' : '\n';
      switch (type) {
        case 'bold':
          return prev + `${prefix}**bold text**`;
        case 'italic':
          return prev + `${prefix}_italic text_`;
        case 'heading':
          return prev + `${prefix}# Heading`;
        case 'bullet':
          return prev + `${prefix}- item`;
        default:
          return prev;
      }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 pr-4"
        >
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>

        <Text className="text-[18px] font-semibold text-[#111827] ml-2 flex-1">
          {!journalId
            ? 'New Entry'
            : isEditing
              ? 'Edit Entry'
              : 'Journal Entry'}
        </Text>

        <View className="flex-row items-center">
          {!isEditing && journalId && (
            <TouchableOpacity onPress={handleDelete} className="p-2 mr-2">
              <Trash size={22} strokeWidth={2} color="red" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="p-2"
            onPress={() => (isEditing ? handleSave() : toggleEdit())}
          >
            {isEditing ? <Save size={24} /> : <Pencil size={24} />}
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 20 : (StatusBar.currentHeight ?? 0)
        }
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {!isEditing && (
              <View className="pb-12">
                <Text className="text-[30px] font-bold text-[#111827]">
                  {title}
                </Text>

                <Text className="text-[#6B7280] mt-1 mb-4">{displayDate}</Text>

                <Markdown
                  style={{
                    body: { fontSize: 18, lineHeight: 26, color: '#333' },
                    heading1: { fontSize: 28, fontWeight: '700' },
                    strong: { fontWeight: 'bold' },
                    bullet_list: { marginVertical: 4 },
                  }}
                >
                  {content}
                </Markdown>
              </View>
            )}

            {isEditing && (
              <>
                <Text className="text-[#374151] mb-2">Title</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Journal title..."
                  placeholderTextColor="#9CA3AF"
                  className="border border-[#D1D5DB] rounded-xl px-4 py-3 text-base mb-5"
                />

                <Text className="text-[#374151] mb-2">Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="border border-[#D1D5DB] rounded-xl px-4 py-3 mb-4"
                >
                  <Text className="text-[#1F2937]">{displayDate}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(journalDateISO)}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={onDateChange}
                  />
                )}

                <View className="flex-row mb-2">
                  <TouchableOpacity
                    className="border border-[#D1D5DB] rounded-lg px-3 py-1 mr-2"
                    onPress={() => applyFormat('bold')}
                  >
                    <Text className="font-bold"> B </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="border border-[#D1D5DB] rounded-lg px-3 py-1 mr-2"
                    onPress={() => applyFormat('italic')}
                  >
                    <Text className="font-semibold italic"> i </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="border border-[#D1D5DB] rounded-lg px-3 py-1 mr-2"
                    onPress={() => applyFormat('heading')}
                  >
                    <Text className="font-semibold text-lg"> H1 </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="border border-[#D1D5DB] rounded-lg px-3 py-1"
                    onPress={() => applyFormat('bullet')}
                  >
                    <Text>• List</Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-[#374151] mb-2">Your Thoughts</Text>
                <TextInput
                  multiline
                  value={content}
                  onChangeText={setContent}
                  textAlignVertical="top"
                  placeholder="Write in markdown..."
                  placeholderTextColor="#9CA3AF"
                  className="h-96 border border-[#D1D5DB] rounded-2xl p-4 text-base text-[#111827]"
                />
              </>
            )}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateJournalScreen;
