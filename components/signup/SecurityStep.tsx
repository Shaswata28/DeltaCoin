import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Eye, EyeOff } from "lucide-react-native";
import { FormInput } from "@/components/common/FormInput";
import { TextNavigation } from "@/components/common/TextNavigation";
import {
  validateUsername,
  validatePassword,
  validatePasswordMatch,
  getPasswordStrengthText,
} from "@/utils/validation";

export interface SecurityInfo {
  username: string;
  password: string;
  confirmPassword: string;
}

interface SecurityStepProps {
  onNext: (data: SecurityInfo) => void;
  onBack: () => void;
  initialData?: SecurityInfo;
}

export default function SecurityStep({
  onNext,
  onBack,
  initialData,
}: SecurityStepProps) {
  const colorScheme = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);
  const isDark = colorScheme === "dark";

  const [formData, setFormData] = useState<SecurityInfo>({
    username: initialData?.username || "",
    password: initialData?.password || "",
    confirmPassword: initialData?.confirmPassword || "",
  });

  const [errors, setErrors] = useState<Partial<SecurityInfo>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (formData.password) {
      const validation = validatePassword(formData.password);
      setPasswordStrength(validation.strength);
    }
  }, [formData.password]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SecurityInfo> = {};

    if (!validateUsername(formData.username)) {
      newErrors.username =
        "Username must be 4-30 characters, start with a letter";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and numbers";
    }

    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "#ff4d4f";
      case 1:
        return "#ffa940";
      case 2:
        return "#fadb14";
      case 3:
        return "#73d13d";
      case 4:
      case 5:
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.step, isDark && styles.stepDark]}>
          Step 2 of 3
        </Text>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Security Setup
        </Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          Create your login credentials
        </Text>
      </View>

      <View style={styles.form}>
        <FormInput
          label="Username"
          value={formData.username}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, username: text }));
            if (errors.username)
              setErrors((prev) => ({ ...prev, username: "" }));
          }}
          placeholder="Choose a username"
          error={errors.username}
          autoComplete="username"
        />

        <View>
          <FormInput
            label="Password"
            value={formData.password}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, password: text }));
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="Create a strong password"
            secureTextEntry={!showPassword}
            rightElement={
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <Eye size={20} color={isDark ? "#A6A6A6" : "#6B6B6B"} />
                ) : (
                  <EyeOff size={20} color={isDark ? "#A6A6A6" : "#6B6B6B"} />
                )}
              </TouchableOpacity>
            }
            error={errors.password}
          />

          <View style={styles.strengthIndicator}>
            <View style={styles.strengthBar}>
              <Animated.View
                style={[
                  styles.strengthFill,
                  {
                    width: `${(passwordStrength / 5) * 100}%`,
                    backgroundColor: getStrengthColor(),
                  },
                ]}
              />
            </View>
            <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
              {getPasswordStrengthText(passwordStrength)}
            </Text>
          </View>
        </View>

        <FormInput
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, confirmPassword: text }));
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          placeholder="Confirm your password"
          secureTextEntry={!showPassword}
          rightElement={
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? (
                <Eye size={20} color={isDark ? "#A6A6A6" : "#6B6B6B"} />
              ) : (
                <EyeOff size={20} color={isDark ? "#A6A6A6" : "#6B6B6B"} />
              )}
            </TouchableOpacity>
          }
          error={errors.confirmPassword}
        />

        <TextNavigation
          onBack={onBack}
          onNext={handleNext}
          backText="← Student Info"
          nextText="PIN Setup →"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#2C2C2C",
    marginBottom: 8,
  },
  titleDark: {
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#6B6B6B",
  },
  subtitleDark: {
    color: "#A6A6A6",
  },
  form: {
    gap: 20,
  },
  strengthIndicator: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    marginTop: 4,
  },
  eyeButton: {
    padding: 8,
  },
});
