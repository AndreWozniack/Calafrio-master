import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import type { FichaViva } from "../../types/ficha";
import { Matriz3x3Mobile } from "./Matriz3x3Mobile";

interface AbaMatrizProps {
  f: FichaViva;
  onSelecionarSlot: (slot: number) => void;
}

export function AbaMatriz({ f, onSelecionarSlot }: AbaMatrizProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Matriz3x3Mobile f={f} onSelecionarSlot={onSelecionarSlot} />
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
