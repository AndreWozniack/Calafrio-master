import type { FichaCalafrio } from "@calafrio/core";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface ChecklistPendenciasProps {
  ficha: FichaCalafrio;
  onNavegarAba?: (aba: "ficha" | "mochila" | "matriz") => void;
}

export function ChecklistPendencias({
  ficha,
  onNavegarAba,
}: ChecklistPendenciasProps) {
  const [expandido, setExpandido] = useState(false);

  const pendencias: { rotulo: string; aba: "ficha" | "mochila" | "matriz" }[] =
    [];

  if (!ficha.retratoUrl) {
    pendencias.push({
      rotulo: "Adicionar retrato do investigador",
      aba: "ficha",
    });
  }

  if (ficha.palavrasChave.length < 3) {
    pendencias.push({
      rotulo: `Adicionar palavras-chave (${ficha.palavrasChave.length}/3 recomendadas)`,
      aba: "ficha",
    });
  }

  if (ficha.matrizHabilidades.length === 0) {
    pendencias.push({
      rotulo: "Alocar habilidades na Matriz 3x3",
      aba: "matriz",
    });
  }

  if (ficha.inventario.length === 0) {
    pendencias.push({
      rotulo: "Equipar ou adicionar itens na mochila",
      aba: "mochila",
    });
  }

  if (pendencias.length === 0) return null;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setExpandido((v) => !v)} style={styles.header}>
        <View style={styles.tituloLinha}>
          <AlertCircle size={16} color={CORES_BASE_CALAFRIO.tintaPreta} />
          <Text style={styles.titulo}>
            Pendências da Ficha ({pendencias.length})
          </Text>
        </View>
        {expandido ? (
          <ChevronUp size={16} color={CORES_BASE_CALAFRIO.tintaPreta} />
        ) : (
          <ChevronDown size={16} color={CORES_BASE_CALAFRIO.tintaPreta} />
        )}
      </Pressable>

      {expandido ? (
        <View style={styles.lista}>
          {pendencias.map((item, idx) => (
            <Pressable
              key={idx}
              onPress={() => onNavegarAba?.(item.aba)}
              style={styles.item}
            >
              <Text style={styles.ponto}>•</Text>
              <Text style={styles.textoItem}>{item.rotulo}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
    borderWidth: 1.5,
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  titulo: {
    fontSize: 12,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  lista: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ponto: {
    fontSize: 14,
    fontWeight: "900",
    color: "#B45309",
  },
  textoItem: {
    fontSize: 12,
    fontWeight: "600",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
});
