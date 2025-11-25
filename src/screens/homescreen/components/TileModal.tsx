import React, { useEffect, useState } from 'react';
import {
  Button,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Config from 'react-native-config';
import * as ImagePicker from 'react-native-image-picker';
import styles from './VisionBoardStyles';

interface TileModalProps {
  visible: boolean;
  imageUrl?: string | null;
  onClose: () => void;
  onSave: (imageUrl: string) => void;
  tileId: string;
}

const TileModal: React.FC<TileModalProps> = ({
  visible,
  imageUrl,
  onClose,
  onSave,
  tileId,
}) => {
  const [tempImageUrl, setTempImageUrl] = useState(imageUrl || '');
  const [tempKeyword, setTempKeyword] = useState('');
  const API_KEY: string = Config.PEXELS_API || '';

  useEffect(() => {
    if (visible) setTempImageUrl(imageUrl || '');
  }, [visible, imageUrl]);

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && response.assets?.[0]?.uri) {
        const uri = response.assets[0].uri;
        setTempImageUrl(uri);
        onSave(uri);
        onClose();
      }
    });
  };

  const fetchImageFromPexels = async (keyword: string) => {
    if (!keyword) return null;
    try {
      console.log('inside fetch image');
      console.log(`'api key: ${API_KEY}`);
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          keyword,
        )}&per_page=1`,
        {
          headers: {
            Authorization: API_KEY,
          },
        },
      );

      console.log('after api call');
      const data = await response.json();
      if (data.photos?.length > 0) return data.photos[0].src.medium;
      return null;
    } catch (error) {
      console.log('Pexels fetch error:', error);
      return null;
    }
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    const imageUrl = await fetchImageFromPexels(tempKeyword);
    if (imageUrl) {
      setTempImageUrl(imageUrl);
      onSave(imageUrl);
      onClose();
    }
  };

  const handleRemove = () => setTempImageUrl('');

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Tile</Text>

            <View style={styles.modalButton}>
              <Button title="Upload Image" onPress={pickImage} />
            </View>

            <TextInput
              placeholder="Enter a keyword to get an image"
              placeholderTextColor="#888"
              value={tempKeyword}
              onChangeText={setTempKeyword}
              style={styles.modalTextInput}
            />
            <View style={styles.modalButton}>
              <Button title="Search" onPress={handleSearch} />
            </View>

            {tempImageUrl ? (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={handleRemove}
              >
                <Text style={styles.removeImageText}>Remove Image</Text>
              </TouchableOpacity>
            ) : null}

            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                color="red"
                onPress={() => {
                  setTempImageUrl(imageUrl || '');
                  onClose();
                }}
              />
              <Button
                title="Save"
                onPress={() => {
                  onSave(tempImageUrl);
                  onClose();
                }}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback> 
    </Modal>
  );
};

export default TileModal;
