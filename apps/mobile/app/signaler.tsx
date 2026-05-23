import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import Button from "../src/components/Button";
import StepIndicator from "../src/components/StepIndicator";
import CategoryPill from "../src/components/CategoryPill";
import { colors } from "../src/theme/colors";
import { spacing, radius, fontSize } from "../src/theme/spacing";
import { DEFAULT_CATEGORIES, CROISSY_CENTER } from "@signalicity/shared";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Step = "photo" | "location" | "classify" | "done";
const STEPS: Step[] = ["photo", "location", "classify", "done"];

export default function SignalerScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("photo");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    DEFAULT_CATEGORIES[0]
  );
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Animations
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  const stepIndex = STEPS.indexOf(step);

  // Auto-get location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        try {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          const [geo] = await Location.reverseGeocodeAsync(loc.coords);
          if (geo) {
            setAddress(
              [geo.streetNumber, geo.street, geo.postalCode, geo.city]
                .filter(Boolean)
                .join(" ")
            );
          }
        } catch {
          setLocation(CROISSY_CENTER);
          setAddress("Croissy-sur-Seine");
        }
      } else {
        setLocation(CROISSY_CENTER);
      }
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPhotoUri(result.assets[0].uri);
      setStep("location");
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPhotoUri(result.assets[0].uri);
      setStep("location");
    }
  };

  const confirmLocation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate AI classification
    setLoading(true);
    setTimeout(() => {
      setDescription(
        "Degradation detectee necessitant une intervention des services techniques."
      );
      setLoading(false);
      setStep("classify");
    }, 1500);
  };

  const submitSignalement = async () => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setStep("done");

      // Animate checkmark
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);
  };

  const close = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={close} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === "done" ? "Envoye !" : "Nouveau signalement"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {step !== "done" && (
        <StepIndicator steps={3} current={stepIndex} />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 1: Photo */}
          {step === "photo" && (
            <View style={styles.step}>
              <Text style={styles.stepTitle}>Prenez une photo</Text>
              <Text style={styles.stepSubtitle}>
                Photographiez le probleme a signaler
              </Text>

              <TouchableOpacity
                onPress={takePhoto}
                activeOpacity={0.8}
                style={styles.cameraBox}
              >
                <View style={styles.cameraInner}>
                  <Ionicons name="camera" size={48} color={colors.accent} />
                  <Text style={styles.cameraText}>Prendre une photo</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickFromGallery}
                style={styles.galleryBtn}
              >
                <Ionicons
                  name="images-outline"
                  size={20}
                  color={colors.accent}
                />
                <Text style={styles.galleryText}>
                  Choisir dans la galerie
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: Location */}
          {step === "location" && (
            <View style={styles.step}>
              <Text style={styles.stepTitle}>Confirmez le lieu</Text>
              <Text style={styles.stepSubtitle}>
                Verifiez que la localisation est correcte
              </Text>

              {photoUri && (
                <Image source={{ uri: photoUri }} style={styles.preview} />
              )}

              {/* Map placeholder */}
              <View style={styles.mapPlaceholder}>
                <Ionicons
                  name="location"
                  size={32}
                  color={colors.accent}
                />
                <Text style={styles.mapText}>
                  {address || "Localisation en cours..."}
                </Text>
                {location && (
                  <Text style={styles.coordsText}>
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </Text>
                )}
              </View>

              <Button
                title="Confirmer la localisation"
                onPress={confirmLocation}
                loading={loading}
              />
            </View>
          )}

          {/* STEP 3: AI Classification + Confirm */}
          {step === "classify" && (
            <View style={styles.step}>
              <Text style={styles.stepTitle}>Verification IA</Text>
              <Text style={styles.stepSubtitle}>
                L&apos;IA a classifie votre signalement. Vous pouvez corriger.
              </Text>

              {photoUri && (
                <Image source={{ uri: photoUri }} style={styles.previewSmall} />
              )}

              {/* Category selection */}
              <Text style={styles.label}>Categorie</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.slug}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedCategory(cat);
                    }}
                    style={[
                      styles.categoryItem,
                      selectedCategory.slug === cat.slug &&
                        styles.categoryActive,
                    ]}
                  >
                    <CategoryPill
                      name={cat.name}
                      slug={cat.slug}
                      color={cat.color}
                      size="small"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Description */}
              <Text style={styles.label}>Description</Text>
              <View style={styles.aiTag}>
                <Ionicons name="sparkles" size={14} color={colors.accent} />
                <Text style={styles.aiTagText}>Suggeree par l&apos;IA</Text>
              </View>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholder="Decrivez le probleme..."
                placeholderTextColor={colors.textTertiary}
              />

              <Button
                title="Envoyer le signalement"
                onPress={submitSignalement}
                loading={loading}
                style={{ marginTop: spacing.md }}
              />
            </View>
          )}

          {/* STEP 4: Done */}
          {step === "done" && (
            <View style={styles.doneStep}>
              <Animated.View
                style={[
                  styles.checkCircle,
                  {
                    transform: [{ scale: checkScale }],
                    opacity: checkOpacity,
                  },
                ]}
              >
                <Ionicons
                  name="checkmark"
                  size={48}
                  color={colors.white}
                />
              </Animated.View>
              <Text style={styles.doneTitle}>Signalement envoye !</Text>
              <Text style={styles.doneText}>
                Vous recevrez une notification a chaque mise a jour.
              </Text>
              <Text style={styles.doneRef}>
                Reference : SIG-{Date.now().toString().slice(-6)}
              </Text>

              <Button
                title="Retour a l'accueil"
                onPress={close}
                style={{ marginTop: spacing.xl }}
              />
              <Button
                title="Nouveau signalement"
                onPress={() => {
                  setStep("photo");
                  setPhotoUri(null);
                  setDescription("");
                }}
                variant="secondary"
                style={{ marginTop: spacing.sm }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: fontSize.body,
    fontWeight: "600",
    color: colors.text,
  },

  body: { flex: 1 },
  bodyContent: { padding: spacing.lg, paddingBottom: spacing.xxl },

  step: {},
  stepTitle: {
    fontSize: fontSize.heading,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },

  cameraBox: {
    width: "100%",
    height: 280,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  cameraInner: { alignItems: "center", gap: spacing.sm },
  cameraText: {
    fontSize: fontSize.body,
    fontWeight: "600",
    color: colors.accent,
  },

  galleryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  galleryText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.accent,
  },

  preview: {
    width: "100%",
    height: 200,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.gray[100],
  },
  previewSmall: {
    width: "100%",
    height: 140,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.gray[100],
  },

  mapPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  mapText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  coordsText: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  categoriesScroll: {
    marginBottom: spacing.sm,
  },
  categoryItem: {
    marginRight: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryActive: {
    borderColor: colors.accent,
  },

  aiTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: spacing.sm,
  },
  aiTagText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: "500",
  },

  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: colors.white,
  },

  doneStep: {
    alignItems: "center",
    paddingTop: 60,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  doneText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  doneRef: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
