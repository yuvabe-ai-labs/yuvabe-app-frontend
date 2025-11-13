import React, { useState } from 'react';
import {
  Button,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

interface TileEditModalProps {
  visible: boolean;
  imageUrl?: string | null;
  onSave: (imageUrl: string | null) => void;
  onClose: () => void;
}

const TileEditModal: React.FC<TileEditModalProps> = ({
  visible,
  imageUrl,
  onSave,
  onClose,
}) => {
  const [tempImageUrl, setTempImageUrl] = useState(imageUrl || '');

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && response.assets?.[0]?.uri) {
        setTempImageUrl(response.assets[0].uri);
      }
    });
  };

  const handleSave = () => {
    onSave(tempImageUrl);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setTempImageUrl(imageUrl || '');
          onClose();
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 20,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}
              >
                Edit Tile
              </Text>

              <Button title="Upload Image" onPress={pickImage} />

              {tempImageUrl ? (
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    backgroundColor: '#fbeaea',
                    padding: 10,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                  onPress={() => setTempImageUrl('')}
                >
                  <Text style={{ color: '#b94a48', fontWeight: '600' }}>
                    Remove Image
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TextInput
                placeholder="or enter Image URL"
                value={tempImageUrl}
                placeholderTextColor="#888"
                onChangeText={setTempImageUrl}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 6,
                  marginTop: 10,
                  padding: 8,
                  color: '#000',
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}
              >
                <Button
                  title="Cancel"
                  color="#999"
                  onPress={() => {
                    setTempImageUrl(imageUrl || '');
                    onClose();
                  }}
                />
                <Button title="Save" onPress={handleSave} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TileEditModal;
