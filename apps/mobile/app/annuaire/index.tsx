import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

const SERVICES = [
  { id: "s1", name: "Mairie", cat: "Administratif", color: "#2563EB", phone: "01 30 53 00 00", email: "mairie@croissy.fr", address: "Place de la Mairie", hours: "Lun 8h30-12h\nMar-Jeu 8h30-17h\nVen 8h30-17h" },
  { id: "s2", name: "Services techniques", cat: "Technique", color: "#F59E0B", phone: "01 30 53 00 10", email: "technique@croissy.fr", address: "8 Rue des Ateliers", hours: "Lun-Ven 8h-16h30" },
  { id: "s3", name: "Police municipale", cat: "Securite", color: "#EF4444", phone: "01 30 53 00 20", email: "pm@croissy.fr", address: "2 Place de la Mairie", hours: "Lun-Ven 8h30-18h\nSam 9h-12h" },
  { id: "s4", name: "Mediatheque", cat: "Culture", color: "#8B5CF6", phone: "01 30 53 00 30", email: "mediatheque@croissy.fr", address: "12 Rue de la Paix", hours: "Mar,Ven 15h-19h\nMer 10h-18h\nSam 10h-17h" },
];

export default function AnnuaireScreen() {
  const router = useRouter();

  const callPhone = (phone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone.replace(/ /g, "")}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Annuaire</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {SERVICES.map((s) => (
          <View key={s.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: `${s.color}15` }]}>
                <Ionicons name="business" size={20} color={s.color} />
              </View>
              <View>
                <Text style={styles.cardName}>{s.name}</Text>
                <Text style={styles.cardCat}>{s.cat}</Text>
              </View>
            </View>

            <View style={styles.infoRows}>
              <TouchableOpacity onPress={() => callPhone(s.phone)} style={styles.infoRow}>
                <Ionicons name="call" size={16} color={colors.accent} />
                <Text style={[styles.infoText, { color: colors.accent, fontWeight: "600" }]}>{s.phone}</Text>
              </TouchableOpacity>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={16} color={colors.textTertiary} />
                <Text style={styles.infoText}>{s.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color={colors.textTertiary} />
                <Text style={styles.infoText}>{s.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={colors.textTertiary} />
                <Text style={styles.infoText}>{s.hours}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: fontSize.body, fontWeight: "600", color: colors.text },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  cardName: { fontSize: 16, fontWeight: "700", color: colors.text },
  cardCat: { fontSize: 12, color: colors.textTertiary },
  infoRows: { gap: 10 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  infoText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
});
