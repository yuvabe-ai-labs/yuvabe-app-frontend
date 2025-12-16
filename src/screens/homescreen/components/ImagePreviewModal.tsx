import React from 'react';
import { Image, Modal, TouchableOpacity, View } from 'react-native';
import styles from './VisionBoardStyles';

interface Props {
  visible: boolean;
  imageUrl?: string | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<Props> = ({
  visible,
  imageUrl,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{
            width: '90%',
            height: '80%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 12,
            }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ImagePreviewModal;
