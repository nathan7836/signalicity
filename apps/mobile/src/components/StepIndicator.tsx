import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

interface Props {
  steps: number;
  current: number;
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: steps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.step,
            i <= current ? styles.active : styles.inactive,
            i < current && styles.completed,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 16,
  },
  step: {
    height: 4,
    flex: 1,
    borderRadius: 2,
    maxWidth: 60,
  },
  active: {
    backgroundColor: colors.accent,
  },
  inactive: {
    backgroundColor: colors.gray[200],
  },
  completed: {
    backgroundColor: colors.accent,
    opacity: 0.5,
  },
});
