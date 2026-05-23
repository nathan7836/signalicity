import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

const EVENTS = [
  { id: "e1", title: "Fete de la musique", desc: "Concert gratuit sur les berges de Seine. Plusieurs groupes locaux.", cat: "Culture", catColor: "#7C3AED", date: "20 juin", time: "18h - 00h", location: "Berges de Seine", img: "https://placehold.co/400x200/7C3AED/white?text=Musique" },
  { id: "e2", title: "Brocante annuelle", desc: "Grande brocante. Plus de 100 exposants. Restauration sur place.", cat: "General", catColor: "#4B5563", date: "5 juin", time: "Journee", location: "Place de la Mairie", img: "https://placehold.co/400x200/4B5563/white?text=Brocante" },
  { id: "e3", title: "Conseil municipal", desc: "Ordre du jour : budget 2026, amenagement berges.", cat: "Conseil", catColor: "#2563EB", date: "27 mai", time: "20h30", location: "Salle du conseil", img: "https://placehold.co/400x200/2563EB/white?text=Conseil" },
  { id: "e4", title: "Stage multisport 6-12 ans", desc: "Stage vacances. Inscription obligatoire. 5 euros/jour.", cat: "Sport", catColor: "#16A34A", date: "7-11 juil.", time: "9h - 17h", location: "Gymnase", img: "https://placehold.co/400x200/16A34A/white?text=Sport" },
  { id: "e5", title: "Atelier seniors numerique", desc: "Initiation tablette et smartphone. Gratuit. 15 places.", cat: "Seniors", catColor: "#DB2777", date: "30 mai", time: "14h - 16h", location: "Espace Pagnol", img: "https://placehold.co/400x200/DB2777/white?text=Seniors" },
];

export default function AgendaScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agenda</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {EVENTS.map((event) => (
          <TouchableOpacity key={event.id} activeOpacity={0.8} style={styles.card}>
            <Image source={{ uri: event.img }} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <View style={[styles.catBadge, { backgroundColor: `${event.catColor}20` }]}>
                <Text style={[styles.catText, { color: event.catColor }]}>{event.cat}</Text>
              </View>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{event.desc}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{event.date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{event.time}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{event.location}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
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
  card: { borderRadius: radius.lg, backgroundColor: colors.surface, overflow: "hidden" },
  cardImage: { width: "100%", height: 130, backgroundColor: colors.gray[200] },
  cardBody: { padding: spacing.md },
  catBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 6 },
  catText: { fontSize: 10, fontWeight: "700" },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: 11, color: colors.textTertiary },
});
