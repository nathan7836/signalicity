import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

interface Msg { id: string; role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "Horaires de la mairie ?",
  "Carte d'identite ?",
  "Ramassage encombrants ?",
  "Tarifs piscine ?",
  "Collecte dechets ?",
  "Inscriptions scolaires ?",
];

const RESPONSES: Record<string, string> = {
  horaires: "La mairie est ouverte :\n- Lundi : 8h30-12h\n- Mardi, Jeudi : 8h30-17h\n- Mercredi : 8h30-12h\n- Vendredi : 8h30-17h\n\nFermee samedi et dimanche.",
  carte: "Pour une carte d'identite :\n1. RDV en ligne sur croissy.fr\n2. Apportez : photo, justificatif domicile, acte de naissance\n3. Delai : 3-4 semaines",
  encombrants: "Ramassage le 1er lundi du mois.\nDeposez la veille au soir devant chez vous.\nMax 2m3 par foyer.\nRDV : 01 30 53 00 10",
  piscine: "Piscine ouverte juin-septembre.\nAdulte : 5 euros\nEnfant : 3 euros\nCarnet 10 entrees : 40 euros",
  dechets: "Ordures menageres : mardi et vendredi\nTri selectif : mercredi\nVerre : points d'apport volontaire\nDechetterie : Chatou, lun-sam",
  inscription: "Inscriptions scolaires de mars a juin en mairie.\nApporter : livret de famille, justificatif de domicile, carnet de vaccinations.",
};

export default function AssistantScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages((p) => [...p, { id: `u${Date.now()}`, role: "user", content: text }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let resp = "Je n'ai pas l'information precise. Contactez la mairie au 01 30 53 00 00 ou par email a mairie@croissy.fr.";
      for (const [k, v] of Object.entries(RESPONSES)) {
        if (lower.includes(k)) { resp = v; break; }
      }
      setMessages((p) => [...p, { id: `a${Date.now()}`, role: "assistant", content: resp }]);
      setLoading(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.aiDot}>
            <Ionicons name="sparkles" size={14} color={colors.accent} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Assistant Croissy</Text>
            <Text style={styles.headerSub}>En ligne 24/7</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={0}>
        {/* Messages */}
        <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
          {messages.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="sparkles" size={40} color={`${colors.accent}40`} />
              <Text style={styles.emptyText}>Comment puis-je vous aider ?</Text>
              <View style={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <TouchableOpacity key={s} onPress={() => send(s)} style={styles.sugBtn}>
                    <Text style={styles.sugText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map((m) => (
            <View key={m.id} style={[styles.msgRow, m.role === "user" && styles.msgRowUser]}>
              {m.role === "assistant" && (
                <View style={styles.avatarBot}>
                  <Ionicons name="sparkles" size={12} color={colors.accent} />
                </View>
              )}
              <View style={[styles.bubble, m.role === "user" ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={[styles.bubbleText, m.role === "user" && { color: colors.white }]}>{m.content}</Text>
              </View>
            </View>
          ))}

          {loading && (
            <View style={styles.msgRow}>
              <View style={styles.avatarBot}>
                <Ionicons name="sparkles" size={12} color={colors.accent} />
              </View>
              <View style={styles.bubbleBot}>
                <View style={styles.dots}>
                  <View style={[styles.dot, { animationDelay: "0ms" }]} />
                  <View style={[styles.dot, { animationDelay: "150ms" }]} />
                  <View style={[styles.dot, { animationDelay: "300ms" }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputWrap}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Votre question..."
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => send(input)}
          />
          <TouchableOpacity
            onPress={() => send(input)}
            disabled={!input.trim()}
            style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
          >
            <Ionicons name="send" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  aiDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: `${colors.accent}15`, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  headerSub: { fontSize: 10, color: colors.textTertiary },
  messages: { flex: 1 },
  messagesContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: spacing.sm },
  emptyText: { fontSize: 15, color: colors.textSecondary },
  suggestions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: spacing.md, paddingHorizontal: spacing.md },
  sugBtn: { backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md },
  sugText: { fontSize: 12, fontWeight: "600", color: colors.text },
  msgRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  msgRowUser: { justifyContent: "flex-end" },
  avatarBot: { width: 26, height: 26, borderRadius: 13, backgroundColor: `${colors.accent}15`, alignItems: "center", justifyContent: "center", marginTop: 2 },
  bubble: { maxWidth: "78%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleUser: { backgroundColor: colors.accent, borderTopRightRadius: 4 },
  bubbleBot: { backgroundColor: colors.surface, borderTopLeftRadius: 4 },
  bubbleText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  dots: { flexDirection: "row", gap: 4, paddingVertical: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gray[300] },
  inputWrap: { flexDirection: "row", gap: 8, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, paddingBottom: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, height: 44, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, fontSize: 15, color: colors.text, backgroundColor: colors.white },
  sendBtn: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
});
