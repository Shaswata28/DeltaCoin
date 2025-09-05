import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  useColorScheme,
} from 'react-native';

interface MonthYearPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  selectedValue: string | null;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  visible,
  onClose,
  onSelect,
  selectedValue,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Parse the selected value to get year and month if it exists
  const [selectedYear, setSelectedYear] = React.useState<number | null>(() => {
    if (selectedValue) {
      // Try to parse from "Month Year" format
      const parts = selectedValue.split(' ');
      if (parts.length === 2) {
        return parseInt(parts[1]);
      }
      return null;
    }
    return null;
  });

  // Generate years (last 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Generate months
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(currentYear, i).toLocaleString('default', {
      month: 'long',
    }),
  }));

  // Reset selected year when modal closes
  React.useEffect(() => {
    if (!visible) {
      setSelectedYear(null);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.monthPickerContainer, isDark && styles.cardDark]}>
          <Text style={[styles.monthPickerTitle, isDark && styles.textDark]}>
            Select Month & Year
          </Text>

          <View style={styles.pickerWrapper}>
            <ScrollView
              style={styles.scrollColumn}
              showsVerticalScrollIndicator={false}
            >
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.pickerItem,
                    selectedYear === year && styles.selectedItem,
                  ]}
                  onPress={() => setSelectedYear(year)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      isDark && styles.textDark,
                      selectedYear === year && styles.selectedItemText,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView
              style={styles.scrollColumn}
              showsVerticalScrollIndicator={false}
            >
              {months.map((month) => {
                const formatted = selectedYear
                  ? `${month.label} ${selectedYear}`
                  : '';
                return (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.pickerItem,
                      selectedValue === formatted && styles.selectedItem,
                      !selectedYear && styles.disabledItem,
                    ]}
                    // Update the onSelect call to ensure consistent format
                    onPress={() => {
                      if (selectedYear) {
                        // Always send in "YYYY-MM" format
                        const formattedMonth = `${selectedYear}-${String(month.value).padStart(2, '0')}`;
                        onSelect(formattedMonth);
                        onClose();
                      }
                    }}
                    disabled={!selectedYear}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        isDark && styles.textDark,
                        selectedValue === formatted && styles.selectedItemText,
                        !selectedYear && styles.disabledText,
                      ]}
                    >
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthPickerContainer: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  monthPickerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  scrollColumn: {
    flex: 1,
    maxHeight: 300,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2C2C2C',
  },
  selectedItem: {
    backgroundColor: '#FFD700',
  },
  selectedItemText: {
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#A6A6A6',
  },
  textDark: {
    color: '#FFFFFF',
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
});

export default MonthYearPicker;