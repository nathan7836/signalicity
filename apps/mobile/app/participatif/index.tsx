import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

const POLL = {
  title: "Budget participatif 2026",
  desc: "Choisissez le projet finance par la commune (50 000 euros).",
  total: 381,
  closes: "20 juin 2026",
  options: [
    { id: "o1", title: "Renovation aires de jeux", desc: "Parc Chanorier, aire tout-petits", cost: 45000, votes: 127 },
    { id: "o2", title: "Piste cyclable rue de Paris", desc: "1.2km securise", cost: 48000, votes: 98 },
    { id: "o3", title: "Jardins partages", desc: "20 parcelles rue des Gabillons", cost: 25000, votes: 84 },
    { id: "o4", title: "Eclairage solaire berges", desc: "15 bornes chemin de halage", cost: 35000, votes: 72 },
  ],
};

const QUICK_POLL = {
  title: "Horaires piscine ete",
  total: 224,
  options: [
    { id: "q1", title: "7h-20h (actuel)", votes: 45 },
    { id: "q2", title: "6h-21h (elargi)", votes: 112 },
    { id: "q3", title: "8h-22h (decale)", votes: 67 },
  ],
};

export default function ParticipatifScreen() {
  const router = useRouter();
  const [voted, setVoted] = useState<string | null>(null);
  const [quickVoted, setQuickVoted] = useState<string | null>(null);
  const maxVotes = Math.max(...POLL.options.map((o) => o.votes));

  const vote = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setVoted(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Participatif</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Budget participatif */}
        <Text style={styles.title}>{POLL.title}</Text>
        <Text style={styles.desc}>{POLL.desc}</Text>
        <View style={styles.budgetBadge}>
          <Ionicons name="cash-outline" size={16} color="#059669" />
          <Text style={styles.budgetText}>50 000 euros - {POLL.total} votes</Text>
        </View>

        {POLL.options.map((opt) => {
          const pct = Math.round((opt.votes / POLL.total) * 100);
          const isLeading = opt.votes === maxVotes;
          const isSelected = voted === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => vote(opt.id)}
              activeOpacity={0.8}
              style={[styles.optionCard, isSelected && styles.optionSelected]}
            >
              <View style={styles.optionHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={styles.optionTitle}>{opt.title}</Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={18} color={colors.accent} />}
                  </View>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                  <Text style={styles.optionCost}>{opt.cost?.toLocaleString("fr-FR")} euros</Text>
                </View>
                <Text style={[styles.optionPct, isLeading && { color: colors.accent }]}>{pct}%</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: isSelected ? colors.accent : isLeading ? colors.accent + "99" : colors.gray[300] }]} />
              </View>
            </TouchableOpacity>
          );
        })}

        {voted && (
          <View style={styles.thanksBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#059669" />
            <Text style={styles.thanksText}>Merci pour votre vote !</Text>
          </View>
        )}

        {/* Quick poll */}
        <View style={styles.divider} />
        <Text style={styles.title}>{QUICK_POLL.title}</Text>
        <Text style={[styles.desc, { marginBottom: spacing.md }]}>Sondage eclair - {QUICK_POLL.total} votes</Text>

        {QUICK_POLL.options.map((opt) => {
          const pct = Math.round((opt.votes / QUICK_POLL.total) * 100);
          const isSelected = quickVoted === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => { Haptics.selectionAsync(); setQuickVoted(opt.id); }}
              style={[styles.quickOption, isSelected && styles.optionSelected]}
            >
              <Text style={styles.quickTitle}>{opt.title}</Text>
              <Text style={styles.quickPct}>{pct}%</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: fontSize.body, fontWeight: "600", color: colors.text },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: 4 },
  desc: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm, lineHeight: 20 },
  budgetBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#D1FAE5", paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md, marginBottom: spacing.md },
  budgetText: { fontSize: 14, fontWeight: "600", color: "#059669" },
  optionCard: { borderWidth: 2, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  optionSelected: { borderColor: colors.accent, backgroundColor: "#EFF6FF" },
  optionHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  optionTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  optionDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  optionCost: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  optionPct: { fontSize: 20, fontWeight: "700", color: colors.gray[400] },
  progressBg: { height: 6, backgroundColor: colors.gray[100], borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  thanksBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#D1FAE5", padding: 12, borderRadius: radius.md, marginTop: spacing.sm },
  thanksText: { fontSize: 14, fontWeight: "600", color: "#059669" },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xl },
  quickOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  quickTitle: { fontSize: 15, fontWeight: "600", color: colors.text },
  quickPct: { fontSize: 16, fontWeight: "700", color: colors.textTertiary },
});
