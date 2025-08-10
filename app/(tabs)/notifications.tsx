import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bell,
  Trash2,
  Clock,
  CreditCard,
  Handshake,
  TriangleAlert as AlertTriangle,
  Info,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeOutRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteAllNotifications,
} from "../../supabase/db";
import type { Notification } from "../../supabase/client";

const getNotificationIcon = (type: string) => {
  const iconData = {
    transaction: {
      icon: <CreditCard size={20} color="#4D9FFF" />,
      color: "#4D9FFF",
    },
    budget_alert: {
      icon: <AlertTriangle size={20} color="#F59E0B" />,
      color: "#F59E0B",
    },
    friend_request: {
      icon: <Handshake size={20} color="#10B981" />,
      color: "#10B981",
    },
    money_request: {
      icon: <CreditCard size={20} color="#A78BFA" />,
      color: "#A78BFA",
    },
    system: { icon: <Info size={20} color="#6B7280" />, color: "#6B7280" },
    default: { icon: <Bell size={20} color="#6B7280" />, color: "#6B7280" },
  };

  return iconData[type as keyof typeof iconData] || iconData.default;
};

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Animation values
  const clearButtonScale = useSharedValue(1);
  const clearButtonOpacity = useSharedValue(1);
  const headerOpacity = useSharedValue(1);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read_status) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read_status: true } : n
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const animateClearButton = () => {
    clearButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  const animateHeaderAndClear = () => {
    // Animate header fade out
    headerOpacity.value = withTiming(0.3, { duration: 300 });

    // Animate clear button
    clearButtonOpacity.value = withSequence(
      withTiming(0.5, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  };

  const resetAnimations = () => {
    headerOpacity.value = withTiming(1, { duration: 300 });
    clearButtonOpacity.value = 1;
    clearButtonScale.value = 1;
  };

  const handleClearAll = async () => {
    animateClearButton();

    Alert.alert(
      "Delete All Notifications",
      "Are you sure you want to permanently delete all notifications? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resetAnimations(),
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            animateHeaderAndClear();

            try {
              // Add a small delay to show the animation
              await new Promise((resolve) => setTimeout(resolve, 500));
              await deleteAllNotifications();

              // Animate notifications disappearing
              setNotifications([]);

              // Reset animations after clearing
              setTimeout(() => {
                resetAnimations();
                setIsClearing(false);
              }, 300);
            } catch (error) {
              console.error("Error deleting all notifications:", error);
              Alert.alert("Error", "Failed to delete notifications");
              resetAnimations();
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Animated styles
  const clearButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: clearButtonScale.value }],
    opacity: clearButtonOpacity.value,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const renderNotificationItem = ({
    item,
    index,
  }: {
    item: Notification;
    index: number;
  }) => {
    const { icon, color } = getNotificationIcon(item.type);

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(300)}
        exiting={FadeOutRight.duration(200)}
        style={[
          styles.notificationItem,
          isDark && styles.notificationItemDark,
          !item.read_status && styles.unreadNotification,
          !item.read_status && isDark && styles.unreadNotificationDark,
        ]}
      >
        <TouchableOpacity
          style={styles.notificationContent}
          onPress={() => handleNotificationPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.notificationHeader}>
            <View
              style={[
                styles.notificationIconContainer,
                { backgroundColor: `${color}15` },
              ]}
            >
              {icon}
            </View>
            <View style={styles.notificationInfo}>
              <Text
                style={[
                  styles.notificationTitle,
                  isDark && styles.notificationTitleDark,
                  !item.read_status && styles.unreadTitle,
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.notificationTime,
                  isDark && styles.notificationTimeDark,
                ]}
              >
                {formatTimeAgo(item.created_at)}
              </Text>
            </View>
            {!item.read_status && <View style={styles.unreadDot} />}
          </View>
          <Text
            style={[
              styles.notificationMessage,
              isDark && styles.notificationMessageDark,
            ]}
          >
            {item.message}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={styles.emptyState}
    >
      <Bell size={64} color={isDark ? "#4B5563" : "#9CA3AF"} />
      <Text
        style={[styles.emptyStateTitle, isDark && styles.emptyStateTitleDark]}
      >
        No Notifications
      </Text>
      <Text
        style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}
      >
        You're all caught up! New notifications will appear here.
      </Text>
    </Animated.View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          isDark && styles.containerDark,
        ]}
      >
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
          Loading notifications...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={isDark ? "#FFFFFF" : "#2C2C2C"} />
          </TouchableOpacity>

          <Text style={[styles.title, isDark && styles.titleDark]}>
            Notifications
          </Text>
        </View>

        <Animated.View style={clearButtonAnimatedStyle}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
            activeOpacity={0.7}
            disabled={notifications.length === 0 || isClearing}
          >
            <Trash2
              size={20}
              color={
                notifications.length === 0 || isClearing
                  ? isDark
                    ? "#4B5563"
                    : "#9CA3AF"
                  : isDark
                  ? "#FFFFFF"
                  : "#2C2C2C"
              }
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {isClearing && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.clearingOverlay}
        >
          <ActivityIndicator size="large" color="#FFD700" />
          <Text
            style={[styles.clearingText, isDark && styles.clearingTextDark]}
          >
            Deleting notifications...
          </Text>
        </Animated.View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={[
          styles.listContainer,
          notifications.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#6B7280",
    marginTop: 16,
  },
  loadingTextDark: {
    color: "#A6A6A6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#2C2C2C",
  },
  titleDark: {
    color: "#FFFFFF",
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  clearingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  clearingText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#FFFFFF",
    marginTop: 16,
  },
  clearingTextDark: {
    color: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },
  notificationItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationItemDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#2E2E2E",
  },
  unreadNotification: {
    backgroundColor: "#EBF5FF",
    borderLeftWidth: 4,
    borderLeftColor: "#4D9FFF",
  },
  unreadNotificationDark: {
    backgroundColor: "#1A2B40",
    borderLeftColor: "#82B1FF",
  },
  notificationContent: {
    padding: 12,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  notificationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#2C2C2C",
    marginBottom: 2,
  },
  notificationTitleDark: {
    color: "#FFFFFF",
  },
  unreadTitle: {
    fontFamily: "Inter-Bold",
  },
  notificationTime: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
  },
  notificationTimeDark: {
    color: "#A6A6A6",
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4D9FFF",
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#4B5563",
    lineHeight: 18,
    marginLeft: 42,
  },
  notificationMessageDark: {
    color: "#D1D5DB",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#2C2C2C",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateTitleDark: {
    color: "#FFFFFF",
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  emptyStateTextDark: {
    color: "#A6A6A6",
  },
});
