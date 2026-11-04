import React, { type ReactNode } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface EtiquetaCalafrioProps {
  children: ReactNode;
  style?: ViewStyle;
  variante?: "padrao" | "amarelo" | "alerta";
}

export function EtiquetaCalafrio({
  children,
  style,
  variante = "padrao",
}: EtiquetaCalafrioProps) {
  const bgCor =
    variante === "amarelo"
      ? CORES_BASE_CALAFRIO.amareloCalafrio
      : variante === "alerta"
        ? "#DC2626"
        : CORES_BASE_CALAFRIO.tintaPreta;

  const textoCor =
    variante === "amarelo" ? CORES_BASE_CALAFRIO.tintaPreta : "#FFFFFF";

  return (
    <View style={[styles.container, { backgroundColor: bgCor }, style]}>
      <Text style={[styles.texto, { color: textoCor }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#111113",
  },
  texto: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
