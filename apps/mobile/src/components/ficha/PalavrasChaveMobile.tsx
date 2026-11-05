import { Dices, Plus, Trash2 } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";
import type { FichaViva } from "../../types/ficha";
import { CartaoPapel, TituloSecao } from "../ui";

interface PalavrasChaveMobileProps {
  f: FichaViva;
  onRolar: (nome: string) => void;
  onAdicionar: () => void;
}

export function PalavrasChaveMobile({
  f,
  onRolar,
  onAdicionar,
}: PalavrasChaveMobileProps) {
  const { derivada } = f;

  return (
    <View style={styles.secao}>
      <TituloSecao
        detalhe={`${derivada.palavrasChaveOcupadas}/${derivada.limitePalavrasChave} (2 + APT)`}
      >
        Palavras-Chave
      </TituloSecao>

      <View style={styles.lista}>
        {derivada.palavrasChaveAtivas.map((p) => (
          <CartaoPapel key={p.id} style={styles.itemCartao}>
            <Pressable
              onPress={() => onRolar(p.nome)}
              style={({ pressed }) => [
                styles.corpoItem,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.iconeContainer}>
                <Dices size={18} color="#FFFFFF" />
              </View>

              <View style={styles.info}>
                <Text style={styles.nomePalavra} numberOfLines={1}>
                  {p.nome}
                </Text>
                <Text style={styles.categoriaTexto}>
                  {p.categoria} • Toque para rolar
                </Text>
              </View>
            </Pressable>

            {!p.semConsumirLimite ? (
              <Pressable
                onPress={() => f.removerPalavraChave(p.id)}
                style={styles.botaoRemover}
                hitSlop={8}
              >
                <Trash2 size={16} color="rgba(17, 17, 19, 0.45)" />
              </Pressable>
            ) : null}
          </CartaoPapel>
        ))}

        <Pressable
          onPress={onAdicionar}
          style={({ pressed }) => [
            styles.botaoAdicionar,
            { opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Plus
            size={18}
            color={CORES_BASE_CALAFRIO.tintaPreta}
            strokeWidth={2.5}
          />
          <Text style={styles.textoAdicionar}>Adicionar palavra-chave</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  secao: {
    marginBottom: 16,
  },
  lista: {
    gap: 8,
  },
  itemCartao: {
    padding: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  corpoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  iconeContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  nomePalavra: {
    fontSize: 15,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  categoriaTexto: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.55)",
    textTransform: "uppercase",
    fontStyle: "italic",
    marginTop: 1,
  },
  botaoRemover: {
    padding: 12,
  },
  botaoAdicionar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(17, 17, 19, 0.35)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 4,
  },
  textoAdicionar: {
    fontSize: 13,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
});
