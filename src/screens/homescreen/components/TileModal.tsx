import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import * as ImagePicker from 'react-native-image-picker';
import { GradientButton } from '../../../components/GradientButton';
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
  const [searching, setSearching] = useState(false);
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
    setSearching(true);

    const imageUrl = await fetchImageFromPexels(tempKeyword);

    setSearching(false);

    if (imageUrl) {
      setTempImageUrl(imageUrl);
      onSave(imageUrl);
      onClose();
    }
  };

  const handleRemove = () => setTempImageUrl('');

  return (
    <Modal visible={visible} animationType="fade" transparent>
      {/* Overlay - dismiss modal on tap */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.modalOverlay}
      >
        {/* Prevent inside touches from closing modal */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalCard}
          onPress={e => e.stopPropagation()}
        >
          {/* Title */}
          <Text style={styles.modalTitle}>Edit Tile</Text>

          {/* Upload Button */}
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          {/* Input */}
          <TextInput
            placeholder="Enter a keyword"
            placeholderTextColor="#A5A5A5"
            value={tempKeyword}
            onChangeText={setTempKeyword}
            style={styles.input}
          />

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>

          {/* Remove Image */}
          {tempImageUrl ? (
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={handleRemove}
            >
              <Text style={styles.removeImageText}>Remove Image</Text>
            </TouchableOpacity>
          ) : null}

          {/* Footer Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <GradientButton
              title="Save"
              onPress={() => {
                onSave(tempImageUrl);
                onClose();
              }}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default TileModal;
