import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  voirie: "construct-outline",
  proprete: "trash-outline",
  eclairage: "bulb-outline",
  "espaces-verts": "leaf-outline",
  "mobilier-urbain": "cube-outline",
  stationnement: "car-outline",
  nuisances: "volume-mute-outline",
  autre: "help-circle-outline",
};

interface Props {
  name: string;
  slug: string;
  color: string;
  size?: "small" | "medium";
}

export default function CategoryPill({ name, slug, color, size = "medium" }: Props) {
  const iconName = ICON_MAP[slug] ?? "help-circle-outline";
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: `${color}15` },
        isSmall && styles.pillSmall,
      ]}
    >
      <Ionicons name={iconName} size={isSmall ? 12 : 16} color={color} />
      <Text style={[styles.text, { color }, isSmall && styles.textSmall]}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pillSmall: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  textSmall: {
    fontSize: 12,
  },
});
