import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
} from "react-native";
import {
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Wallet,
  CirclePlus as PlusCircle,
  Clock,
  CircleHelp as HelpCircle,
  Bell,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { getHomeWalletData, getUnreadNotificationsCount } from "@/supabase/db";
import { supabase } from "@/supabase/client";

interface Transaction {
  id: string;
  type: "send" | "receive";
  amount: number;
  recipient: string;
  category: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

interface WalletData {
  balance: number;
  monthlySpent: number;
  monthlyLimit: number;
  recentTransactions: Transaction[];
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    monthlySpent: 0,
    monthlyLimit: 2000,
    recentTransactions: [],
  });

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 17) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };

    updateGreeting();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          fetchWalletData();
          fetchUnreadCount();
        } else if (event === "SIGNED_OUT") {
          router.replace("/login");
        }
      }
    );

    const channel = supabase.channel("public:transactions");

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        () => {
          fetchWalletData();
        }
      )
      .subscribe();

    // Listen for notification changes
    const notificationChannel = supabase.channel("public:notifications");

    notificationChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      authListener?.subscription.unsubscribe();
      channel.unsubscribe();
      notificationChannel.unsubscribe();
    };
  }, [router]);

  const fetchWalletData = async () => {
    try {
      const homeData = await getHomeWalletData();

      setWalletData({
        balance: homeData.balance,
        monthlySpent: homeData.monthlySpent,
        monthlyLimit: homeData.monthlyLimit || 2000,
        recentTransactions: homeData.recentTransactions,
      });

      setError(null);
    } catch (err: any) {
      setError("Failed to load wallet data. Please try again.");
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (err: any) {
      console.error("Failed to fetch unread notifications count:", err);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchUnreadCount();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchWalletData(), fetchUnreadCount()]);
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toFixed(2)}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWalletData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const spendingProgress =
    (walletData.monthlySpent / walletData.monthlyLimit) * 100;

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={{ paddingBottom: 85 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={styles.greetingContainer}
        >
          <Text style={[styles.greeting, isDark && styles.textDark]}>
            {greeting}
          </Text>
          <Text style={[styles.date, isDark && styles.textLightDark]}>
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push("/notifications")}
          activeOpacity={0.7}
        >
          <Bell size={24} color={isDark ? "#FFFFFF" : "#2C2C2C"} />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 99 ? "99+" : unreadCount.toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(600).springify()}
        style={[styles.balanceCard, isDark && styles.balanceCardDark]}
      >
        <View
          style={[styles.cardLeftSection, isDark && styles.cardLeftSectionDark]}
        >
          <Wallet size={48} color="#FFD700" />
        </View>
        <View
          style={[
            styles.cardRightSection,
            isDark && styles.cardRightSectionDark,
          ]}
        >
          <Text style={[styles.balanceLabel, isDark && styles.textLightDark]}>
            Available Balance
          </Text>
          <Text style={[styles.balanceAmount, isDark && styles.textDark]}>
            {formatCurrency(walletData.balance)}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(600).springify()}
        style={styles.quickActions}
      >
        <TouchableOpacity
          style={[styles.actionButton, isDark && styles.actionButtonDark]}
          onPress={() => router.push("/transactions")}
        >
          <Send size={24} color="#FFD700" />
          <Text style={[styles.actionText, isDark && styles.textDark]}>
            Pay
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isDark && styles.actionButtonDark]}
          onPress={() => router.push("/transactions")}
        >
          <PlusCircle size={24} color="#4D9FFF" />
          <Text style={[styles.actionText, isDark && styles.textDark]}>
            Top-up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isDark && styles.actionButtonDark]}
          onPress={() => router.push("/history")}
        >
          <Clock size={24} color="#10B981" />
          <Text style={[styles.actionText, isDark && styles.textDark]}>
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isDark && styles.actionButtonDark]}
          onPress={() => router.push("/help")}
        >
          <HelpCircle size={24} color="#A78BFA" />
          <Text style={[styles.actionText, isDark && styles.textDark]}>
            Help
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Monthly Budget
          </Text>
          <TouchableOpacity onPress={() => router.push("/analytics")}>
            <Text style={styles.seeAll}>See Details</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.budgetCard, isDark && styles.cardDark]}>
          <View style={styles.budgetInfo}>
            <Text style={[styles.budgetText, isDark && styles.textLightDark]}>
              Monthly Spending
            </Text>
            <Text style={[styles.budgetAmount, isDark && styles.textDark]}>
              {formatCurrency(walletData.monthlySpent)} /{" "}
              {formatCurrency(walletData.monthlyLimit)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(spendingProgress, 100)}%` },
                spendingProgress > 100 && styles.progressOverLimit,
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Recent Transactions
          </Text>
          <TouchableOpacity onPress={() => router.push("/history")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {walletData.recentTransactions.map((transaction, index) => (
          <Animated.View
            key={transaction.id}
            entering={FadeInRight.delay(index * 100).duration(400)}
            style={[styles.transactionCard, isDark && styles.cardDark]}
          >
            <View style={styles.transactionInfo}>
              <Text style={[styles.transactionName, isDark && styles.textDark]}>
                {transaction.recipient}
              </Text>
              <Text
                style={[styles.transactionTime, isDark && styles.textLightDark]}
              >
                {formatTime(transaction.timestamp)}
              </Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text
                style={[
                  styles.amount,
                  transaction.type === "send"
                    ? isDark
                      ? styles.amountSentDark
                      : styles.amountSent
                    : isDark
                    ? styles.amountReceivedDark
                    : styles.amountReceived,
                ]}
              >
                {transaction.type === "send" ? "-" : "+"}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          </Animated.View>
        ))}
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
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#FF4D4F",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4D9FFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  greetingContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4D4F",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  greeting: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
  },
  balanceCard: {
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceCardDark: {
    backgroundColor: "#1E1E1E",
  },
  cardLeftSection: {
    width: 100,
    backgroundColor: "#2C3E50",
    justifyContent: "center",
    alignItems: "center",
  },
  cardLeftSectionDark: {
    backgroundColor: "#2C3E50",
  },
  cardRightSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },
  cardRightSectionDark: {
    backgroundColor: "#1E1E1E",
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#6B7280",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#1F2937",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    width: "23%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonDark: {
    backgroundColor: "#1E1E1E",
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#1F2937",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1F2937",
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#4D9FFF",
  },
  budgetCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  budgetInfo: {
    marginBottom: 12,
  },
  budgetText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#1F2937",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  progressOverLimit: {
    backgroundColor: "#EF4444",
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1F2937",
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
  },
  transactionAmount: {
    marginLeft: 16,
  },
  amount: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  amountSent: {
    color: "#EF4444",
  },
  amountReceived: {
    color: "#10B981",
  },
  amountSentDark: {
    color: "#FF6B6B",
  },
  amountReceivedDark: {
    color: "#34D399",
  },
  textDark: {
    color: "#FFFFFF",
  },
  textLightDark: {
    color: "#A6A6A6",
  },
});
