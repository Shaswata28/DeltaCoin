import { Tabs } from "expo-router";
import {
  Home,
  ChartLine as LineChart,
  ArrowLeftRight,
  User,
  History,
  Users,
} from "lucide-react-native";
import { useColorScheme, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F9FAFB" }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFD700",
          tabBarInactiveTintColor: isDark ? "#A6A6A6" : "#808080",
          tabBarStyle: {
            backgroundColor: "transparent",
            position: "absolute",
            bottom: 0, // Changed to 0 to remove bottom spacing
            left: 0, // Changed to 0 to extend full width
            right: 0, // Changed to 0 to extend full width
            height: 65,
            // Only round the top corners
            borderTopWidth: 0,
            elevation: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            paddingTop: 8,
            paddingBottom: 20,
          },
          headerShown: false,
          tabBarBackground: () => (
            <View
              style={{
                backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderTopLeftRadius: 20, // Match the tab bar's top corners
                borderTopRightRadius: 20, // Match the tab bar's top corners
                borderBottomLeftRadius: 0, // Remove bottom rounding
                borderBottomRightRadius: 0, // Remove bottom rounding
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <Home size={24} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            tabBarIcon: ({ color }) => (
              <ArrowLeftRight size={24} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            tabBarIcon: ({ color }) => (
              <History size={24} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            tabBarIcon: ({ color }) => (
              <LineChart size={24} color={color} strokeWidth={2} />
            ),
          }}
        />

        <Tabs.Screen
          name="notifications"
          options={{
            href: null, // This makes the screen routable but not visible in tabs
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color }) => (
              <User size={24} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
