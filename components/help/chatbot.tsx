import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useColorScheme, Dimensions } from 'react-native';
import { Send } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [chatInput, setChatInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const windowHeight = Dimensions.get('window').height;
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your DeltaCoin assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(chatInput),
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('payment') || input.includes('transaction')) {
      return 'For payment related issues, please check your transaction history in the Transactions tab. If you need more help, you can contact our support team.';
    }
    
    if (input.includes('account') || input.includes('login')) {
      return 'For account related queries, please visit the Security section in Settings. You can manage your login credentials and security preferences there.';
    }
    
    if (input.includes('balance') || input.includes('money')) {
      return 'You can check your balance in the Home tab. For adding funds, use the Top-Up option in the Transactions section.';
    }

    return `I understand you're asking about "${userInput}". Let me help you with that. Please provide more details about your query.`;
  };

  return (
    <Animated.View 
      entering={FadeInDown.duration(300)}
      style={[
        styles.container, 
        isDark && styles.containerDark,
        { height: Math.min(windowHeight * 0.7, 500) }
      ]}
    >
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>AI Support Chat</Text>
        <TouchableOpacity 
          style={styles.closeButtonContainer} 
          onPress={onClose}
        >
          <Text style={[styles.closeButton, isDark && styles.closeButtonDark]}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={true}
      >
        {chatMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.aiMessage,
              isDark && (message.sender === 'user' ? styles.userMessageDark : styles.aiMessageDark)
            ]}
          >
            <Text style={[
              styles.messageText,
              message.sender === 'ai' && styles.aiMessageText,
              isDark && styles.messageTextDark
            ]}>
              {message.text}
            </Text>
            <Text style={[
              styles.timestamp,
              message.sender === 'ai' && styles.aiTimestamp,
              isDark && styles.timestampDark
            ]}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Type your message..."
          placeholderTextColor={isDark ? '#A6A6A6' : '#6B6B6B'}
          onSubmitEditing={handleSendMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            !chatInput.trim() && styles.sendButtonDisabled,
            isDark && styles.sendButtonDark
          ]} 
          onPress={handleSendMessage}
          disabled={!chatInput.trim()}
        >
          <Send size={20} color={chatInput.trim() ? '#FFFFFF' : (isDark ? '#4D4D4D' : '#A6A6A6')} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    margin: '2%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  containerDark: {
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4%',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerDark: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#2E2E2E',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  closeButtonContainer: {
    padding: '2%',
  },
  closeButton: {
    color: '#4D9FFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  closeButtonDark: {
    color: '#82B1FF',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: '4%',
    paddingBottom: '6%',
  },
  messageContainer: {
    maxWidth: '80%',
    padding: '3%',
    borderRadius: 12,
    marginBottom: '3%',
  },
  userMessage: {
    backgroundColor: '#4D9FFF',
    alignSelf: 'flex-end',
  },
  userMessageDark: {
    backgroundColor: '#82B1FF',
  },
  aiMessage: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
  },
  aiMessageDark: {
    backgroundColor: '#2E2E2E',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  aiMessageText: {
    color: '#2C2C2C',
  },
  messageTextDark: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  aiTimestamp: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  timestampDark: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: '4%',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  inputContainerDark: {
    backgroundColor: '#1E1E1E',
    borderTopColor: '#2E2E2E',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#2C2C2C',
    maxHeight: 100,
  },
  inputDark: {
    backgroundColor: '#2E2E2E',
    color: '#FFFFFF',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4D9FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  sendButtonDark: {
    backgroundColor: '#2E2E2E',
  },
});