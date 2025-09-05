import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Linking,
} from "react-native";
import {
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
  CircleHelp as HelpCircle,
  Shield,
  Wallet,
  Bell,
  Bug,
  ArrowLeft,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ChatBot } from "../components/help/chatbot";
import { BugReport } from "../components/help/BugReport";
import { useRouter } from "expo-router";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface SupportCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export default function HelpScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "How do I add money to my account?",
      answer:
        "You can add money to your account through the Top-Up section in Transactions. We support bank transfers, credit/debit cards, and mobile banking options.",
    },
    {
      id: "2",
      question: "What should I do if a payment fails?",
      answer:
        "If a payment fails, first check your balance and internet connection. If the issue persists, you can find the failed transaction in your history and try again or contact support.",
    },
    {
      id: "3",
      question: "How do I reset my PIN?",
      answer:
        "To reset your PIN, go to Settings > Security > Reset PIN. You'll need to verify your identity through your registered email address.",
    },
    {
      id: "4",
      question: "Is my money safe?",
      answer:
        "Yes! We use industry-standard encryption and security measures to protect your money and personal information. All transactions are secured and monitored 24/7.",
    },
  ];

  const categories: SupportCategory[] = [
    {
      id: "1",
      title: "Account Security",
      icon: <Shield size={24} color="#FFD700" />,
      description: "PIN reset, security settings, and account protection",
    },
    {
      id: "2",
      title: "Payments & Transfers",
      icon: <Wallet size={24} color="#4D9FFF" />,
      description: "Transaction issues, payment methods, and limits",
    },
    {
      id: "3",
      title: "Notifications",
      icon: <Bell size={24} color="#10B981" />,
      description: "Push notifications, email alerts, and preferences",
    },
  ];

  const handleEmailSupport = () => {
    Linking.openURL("mailto:support@deltacoin.edu.bd");
  };

  const handlePhoneSupport = () => {
    Linking.openURL("tel:+880123456789");
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={isDark ? "#FFFFFF" : "#2C2C2C"} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            Help & Support
          </Text>
        </View>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          How can we help you today?
        </Text>
      </View>

      <View style={styles.contactSection}>
        <TouchableOpacity
          style={[styles.contactButton, isDark && styles.contactButtonDark]}
          onPress={handleEmailSupport}
        >
          <Mail size={24} color="#FFD700" />
          <Text style={[styles.contactText, isDark && styles.contactTextDark]}>
            Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactButton, isDark && styles.contactButtonDark]}
          onPress={handlePhoneSupport}
        >
          <Phone size={24} color="#4D9FFF" />
          <Text style={[styles.contactText, isDark && styles.contactTextDark]}>
            Call
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactButton, isDark && styles.contactButtonDark]}
          onPress={() => setShowChat(true)}
        >
          <MessageCircle size={24} color="#10B981" />
          <Text style={[styles.contactText, isDark && styles.contactTextDark]}>
            Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactButton, isDark && styles.contactButtonDark]}
          onPress={() => setShowBugReport(true)}
        >
          <Bug size={24} color="#FF4D4F" />
          <Text style={[styles.contactText, isDark && styles.contactTextDark]}>
            Report
          </Text>
        </TouchableOpacity>
      </View>

      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
      {showBugReport && <BugReport onClose={() => setShowBugReport(false)} />}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Frequently Asked Questions
        </Text>
        <View style={styles.faqList}>
          {faqs.map((faq, index) => (
            <Animated.View
              key={faq.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <TouchableOpacity
                style={[styles.faqItem, isDark && styles.faqItemDark]}
                onPress={() =>
                  setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                }
              >
                <View style={styles.faqHeader}>
                  <HelpCircle size={20} color="#FFD700" />
                  <Text
                    style={[
                      styles.faqQuestion,
                      isDark && styles.faqQuestionDark,
                    ]}
                  >
                    {faq.question}
                  </Text>
                </View>
                {expandedFaq === faq.id && (
                  <Text
                    style={[styles.faqAnswer, isDark && styles.faqAnswerDark]}
                  >
                    {faq.answer}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#2C2C2C",
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
  contactSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactButtonDark: {
    backgroundColor: "#1E1E1E",
  },
  contactText: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#2C2C2C",
  },
  contactTextDark: {
    color: "#FFFFFF",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#2C2C2C",
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: "#FFFFFF",
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardDark: {
    backgroundColor: "#1E1E1E",
  },
  categoryContent: {
    flex: 1,
    marginLeft: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#2C2C2C",
    marginBottom: 4,
  },
  categoryTitleDark: {
    color: "#FFFFFF",
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6B6B6B",
  },
  categoryDescriptionDark: {
    color: "#A6A6A6",
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  faqItemDark: {
    backgroundColor: "#1E1E1E",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#2C2C2C",
  },
  faqQuestionDark: {
    color: "#FFFFFF",
  },
  faqAnswer: {
    marginTop: 12,
    marginLeft: 32,
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6B6B6B",
    lineHeight: 20,
  },
  faqAnswerDark: {
    color: "#A6A6A6",
  },
});
