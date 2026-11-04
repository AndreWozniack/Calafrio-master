import React, { type ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { CORES_BASE_CALAFRIO, ESTILOS_CALAFRIO } from "../../theme/tokens";

interface CartaoPapelProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function CartaoPapel({ children, style }: CartaoPapelProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CORES_BASE_CALAFRIO.papelCartao,
    padding: 12,
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    ...ESTILOS_CALAFRIO.sombraSeca,
  },
});
