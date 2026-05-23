import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";
import Button from "../../src/components/Button";
import { signIn, signUp } from "../../src/lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
      router.replace("/(tabs)");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logo}>
            <Ionicons name="shield-checkmark" size={32} color={colors.white} />
          </View>
          <Text style={styles.appName}>Signalicity</Text>
          <Text style={styles.commune}>Croissy-sur-Seine</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === "signup" && (
            <View style={styles.field}>
              <Text style={styles.label}>Nom complet</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Jean Dupont"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="jean@email.fr"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Votre mot de passe"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
            />
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            title={mode === "login" ? "Se connecter" : "Creer un compte"}
            onPress={handleSubmit}
            loading={loading}
          />

          <TouchableOpacity
            onPress={() => setMode(mode === "login" ? "signup" : "login")}
            style={styles.switchBtn}
          >
            <Text style={styles.switchText}>
              {mode === "login"
                ? "Pas encore de compte ? Inscription"
                : "Deja un compte ? Connexion"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Guest */}
        <TouchableOpacity onPress={handleGuest} style={styles.guestBtn}>
          <Text style={styles.guestText}>Continuer sans compte</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },

  logoWrap: { alignItems: "center", marginBottom: spacing.xl },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  commune: {
    fontSize: fontSize.body,
    color: colors.textTertiary,
    marginTop: 2,
  },

  form: { gap: spacing.md },
  field: {},
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  errorText: {
    fontSize: fontSize.caption,
    color: "#DC2626",
  },

  switchBtn: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  switchText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: "600",
  },

  guestBtn: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
  guestText: {
    fontSize: 14,
    color: colors.textTertiary,
    textDecorationLine: "underline",
  },
});
