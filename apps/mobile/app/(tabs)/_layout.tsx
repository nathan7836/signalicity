import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TAB_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home-outline",
  "mes-signalements": "list-outline",
  notifications: "notifications-outline",
};

const TAB_ICON_ACTIVE: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home",
  "mes-signalements": "list",
  notifications: "notifications",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTitleStyle: { fontWeight: "600" },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#F3F4F6",
          height: 88,
          paddingBottom: 30,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap = focused ? TAB_ICON_ACTIVE : TAB_ICON;
          const iconName = iconMap[route.name] ?? "help-circle-outline";
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Accueil", headerTitle: "Signalicity" }}
      />
      <Tabs.Screen
        name="mes-signalements"
        options={{ title: "Mes signalements", headerTitle: "Mes signalements" }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ title: "Notifications", headerTitle: "Notifications" }}
      />
    </Tabs>
  );
}
