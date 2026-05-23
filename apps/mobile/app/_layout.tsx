import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="signaler"
          options={{
            presentation: "fullScreenModal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="signalement/[id]" />
        <Stack.Screen name="alertes/index" />
        <Stack.Screen name="agenda/index" />
        <Stack.Screen name="annuaire/index" />
        <Stack.Screen name="participatif/index" />
        <Stack.Screen
          name="assistant/index"
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="auth/login" />
      </Stack>
    </>
  );
}
