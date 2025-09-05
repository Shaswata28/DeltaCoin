import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface BugReportProps {
  onClose: () => void;
}

export function BugReport({ onClose }: BugReportProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [bugDescription, setBugDescription] = useState("");

  const handleSubmit = () => {
    if (!bugDescription.trim()) return;
    // Here you would typically send the bug report to your backend
    alert("Thank you for reporting this issue. Our team will investigate it.");
    setBugDescription("");
    onClose();
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={[styles.container, isDark && styles.containerDark]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Report an Issue
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        value={bugDescription}
        onChangeText={setBugDescription}
        placeholder="Describe the issue you're experiencing..."
        placeholderTextColor={isDark ? "#A6A6A6" : "#6B6B6B"}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          !bugDescription.trim() && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!bugDescription.trim()}
      >
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  containerDark: {
    backgroundColor: "#1E1E1E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#2C2C2C",
  },
  titleDark: {
    color: "#FFFFFF",
  },
  closeButton: {
    color: "#4D9FFF",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#2C2C2C",
    marginBottom: 16,
  },
  inputDark: {
    backgroundColor: "#2E2E2E",
    color: "#FFFFFF",
  },
  submitButton: {
    backgroundColor: "#4D9FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
});
