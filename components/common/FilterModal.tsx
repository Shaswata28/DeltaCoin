import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Coffee, Book, Beaker, Users, MoreHorizontal, Check,ArrowDownRight } from 'lucide-react-native';

const categoryIcons: Record<string, { Icon: React.ElementType; color: string }> = {
  Canteen: { Icon: Coffee, color: '#FFD700' },
  Library: { Icon: Book, color: '#4D9FFF' },
  Lab: { Icon: Beaker, color: '#FF6B6B' },
  Club: { Icon: Users, color: '#10B981' },
  Other: { Icon: MoreHorizontal, color: '#A78BFA' },
  'All Categories': { Icon: MoreHorizontal, color: '#9CA3AF' },
  topup: { Icon: ArrowDownRight, color: '#52C41A' },
};

interface CategoryFilterModalProps {
  visible: boolean;
  onClose: () => void;
  selected: string | null;
  onSelect: (category: string | null) => void;
  categories: string[];
  isDark?: boolean;
}

export const CategoryFilterModal: React.FC<CategoryFilterModalProps> = ({
  visible,
  onClose,
  selected,
  onSelect,
  categories,
  isDark = false,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
              <Text style={[styles.modalTitle, isDark && styles.textDark]}>
                Select Category
              </Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {categories.map((item) => {
                  const { Icon, color } = categoryIcons[item];

                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.modalItem,
                        selected === item && styles.selectedItem,
                        isDark && styles.modalItemDark,
                      ]}
                      onPress={() => {
                        onSelect(item === 'All Categories' ? null : item);
                        onClose();
                      }}
                    >
                      <View style={styles.itemContent}>
                        <Icon size={20} color={color} />
                        <Text style={[styles.modalItemText, isDark && styles.modalItemTextDark]}>
                          {item}
                        </Text>
                      </View>

                      {selected === item && <Check size={20} color="#FFD700" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center' as const,
  },
  modalContent: {
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
  modalContentDark: {
    backgroundColor: '#1E1E1E',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    marginBottom: 16,
    textAlign: 'center',
  },
  textDark: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingVertical: 8,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  modalItemDark: {
    backgroundColor: 'transparent',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedItem: {
    backgroundColor: '#FFD700',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2C2C2C',
  },
  modalItemTextDark: {
    color: '#FFFFFF',
  },
});