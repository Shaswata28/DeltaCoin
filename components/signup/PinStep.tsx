import { useState, useEffect } from "react";
import { View, StyleSheet, Text, useColorScheme } from "react-native";
import { PinInput } from "@/components/common/PinInput";
import { TextNavigation } from "@/components/common/TextNavigation";
import { ErrorMessage } from "@/components/common/ErrorMessage";

export interface PinInfo {
  pin: string;
}

interface PinStepProps {
  onSubmit: (data: PinInfo) => void;
  onBack: () => void;
  initialData?: PinInfo;
  error?: string;
}

export default function PinStep({
  onSubmit,
  onBack,
  initialData,
  error,
}: PinStepProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [pin, setPin] = useState(initialData?.pin || "");
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setPinError(error);
    }
  }, [error]);

  const validatePin = (pin: string): boolean => {
    if (pin.length !== 5) {
      setPinError("PIN must be 5 digits");
      return false;
    }
    if (!/^\d+$/.test(pin)) {
      setPinError("PIN must contain only numbers");
      return false;
    }
    setPinError(null);
    return true;
  };

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
    if (pinError) {
      validatePin(newPin);
    }
  };

  const handleSubmit = () => {
    if (validatePin(pin)) {
      onSubmit({ pin });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.step, isDark && styles.stepDark]}>
          Step 3 of 3
        </Text>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Create Your PIN
        </Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          This PIN will be used to secure your transactions
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.pinContainer}>
          <PinInput value={pin} onChange={handlePinChange} length={5} />
          {pinError && <ErrorMessage message={pinError} />}
        </View>
      </View>

      <View style={styles.navigationContainer}>
        <TextNavigation onBack={onBack} backText="← Security" />
        <TextNavigation
          onNext={handleSubmit}
          nextText="Complete →"
          disabled={pin.length !== 5}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 32,
  },
  step: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#FFD700",
    marginBottom: 8,
  },
  stepDark: {
    color: "#FFD700",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#111827",
    marginBottom: 8,
  },
  titleDark: {
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
  },
  subtitleDark: {
    color: "#A6A6A6",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  pinContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 16,
  },
});
