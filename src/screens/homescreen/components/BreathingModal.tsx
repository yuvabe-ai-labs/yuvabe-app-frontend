import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

interface Props {
  visible: boolean;
  duration?: number; // default 30 seconds
  onFinish: () => void;
  onClose: () => void;
}

const BreathingModal: React.FC<Props> = ({
  visible,
  duration = 30,
  onFinish,
  onClose,
}) => {
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    if (!visible) return;

    setSeconds(duration);

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onFinish(); // auto-close or handle end
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible,duration,onFinish]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Take a moment and pause</Text>

          <LottieView
            source={require("../../../assets/animations/Breathe.json")} // /home/shri/Desktop/Wellness App/yuvabe-app-frontend/assets
            autoPlay
            loop
            style={styles.lottie}
          />

          <Text style={styles.timerText}>{seconds}s</Text>
        </View>
      </View>
    </Modal>
  );
};

export default BreathingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 14,
    width: "85%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  lottie: {
    width: 180,
    height: 180,
  },
  timerText: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  closeText: {
    fontSize: 20,
    color: "#000",
  },
});
