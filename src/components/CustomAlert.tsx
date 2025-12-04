import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean; // makes confirm button red
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 16,
              elevation: 10,
            }}
          >
            {/* Title */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#222',
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              {title}
            </Text>

            {/* Message */}
            <Text
              style={{
                fontSize: 16,
                color: '#555',
                marginBottom: 25,
                textAlign: 'center',
              }}
            >
              {message}
            </Text>

            {/* Buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              {/* Cancel */}
              <TouchableOpacity
                onPress={onCancel}
                style={{
                  flex: 1,
                  backgroundColor: '#E5E7EB',
                  paddingVertical: 12,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ textAlign: 'center', color: '#333', fontSize: 16 }}
                >
                  {cancelText}
                </Text>
              </TouchableOpacity>

              {/* Confirm */}
              <TouchableOpacity
                onPress={onConfirm}
                style={{
                  flex: 1,
                  backgroundColor: destructive ? '#FF4B4B' : '#4CAF50',
                  paddingVertical: 12,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}
                >
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomAlert;
