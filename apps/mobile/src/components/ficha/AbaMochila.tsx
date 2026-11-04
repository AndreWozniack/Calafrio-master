import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import type { FichaViva } from "../../types/ficha";
import { CarteiraMobile } from "./CarteiraMobile";
import { InventarioMobile } from "./InventarioMobile";

interface AbaMochilaProps {
  f: FichaViva;
  onAdicionarItem: () => void;
}

export function AbaMochila({ f, onAdicionarItem }: AbaMochilaProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <CarteiraMobile f={f} />
      <InventarioMobile f={f} onAdicionarItem={onAdicionarItem} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 40,
  },
});
