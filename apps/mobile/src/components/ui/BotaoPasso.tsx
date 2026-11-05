import * as Haptics from "expo-haptics";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface BotaoPassoProps {
  sentido: "mais" | "menos";
  onPress: () => void;
  tamanho?: number;
}

export function BotaoPasso({
  sentido,
  onPress,
  tamanho = 38,
}: BotaoPassoProps) {
  const Icone = sentido === "mais" ? Plus : Minus;

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.botao,
        {
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.92 : 1 }],
        },
      ]}
    >
      <Icone size={tamanho * 0.55} color="#FFFFFF" strokeWidth={3} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    alignItems: "center",
    justifyContent: "center",
  },
});
