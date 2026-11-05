import type { FichaCalafrio } from "@calafrio/core";
import { Copy, Trash2, User } from "lucide-react-native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";
import { CartaoPapel, EtiquetaCalafrio } from "../ui";

interface CartaoPlayerItemProps {
  personagem: FichaCalafrio;
  onAbrir: () => void;
  onDuplicar: () => void;
  onExcluir: () => void;
}

export function CartaoPlayerItem({
  personagem,
  onAbrir,
  onDuplicar,
  onExcluir,
}: CartaoPlayerItemProps) {
  return (
    <CartaoPapel style={styles.cardPlayer}>
      <Pressable onPress={onAbrir} style={styles.cardCorpo}>
        {/* Retrato Thumbnail */}
        <View style={styles.retratoContainer}>
          {personagem.retratoUrl ? (
            <Image
              source={{ uri: personagem.retratoUrl }}
              style={styles.retratoImagem}
            />
          ) : (
            <User size={24} color="rgba(17, 17, 19, 0.3)" />
          )}
        </View>

        {/* Dados do Investigador */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardNome} numberOfLines={1}>
            {personagem.nome}
          </Text>
          <Text style={styles.cardConceito} numberOfLines={1}>
            {personagem.jogador
              ? `Jogador: ${personagem.jogador}`
              : "Investigador"}
          </Text>
          <View style={styles.tagsLinha}>
            <EtiquetaCalafrio style={styles.tagItem}>
              APT {personagem.aptBase}
            </EtiquetaCalafrio>
            <EtiquetaCalafrio variante="amarelo" style={styles.tagItem}>
              {personagem.palavrasChave.length} palavras
            </EtiquetaCalafrio>
          </View>
        </View>
      </Pressable>

      {/* Ações do Card */}
      <View style={styles.cardAcoes}>
        <Pressable onPress={onDuplicar} style={styles.acaoBotao} hitSlop={8}>
          <Copy size={16} color="rgba(17, 17, 19, 0.6)" />
        </Pressable>
        <Pressable onPress={onExcluir} style={styles.acaoBotao} hitSlop={8}>
          <Trash2 size={16} color="#DC2626" />
        </Pressable>
      </View>
    </CartaoPapel>
  );
}

const styles = StyleSheet.create({
  cardPlayer: {
    padding: 0,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardCorpo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  retratoContainer: {
    width: 48,
    height: 48,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  retratoImagem: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  cardConceito: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(17, 17, 19, 0.6)",
    marginTop: 1,
  },
  tagsLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  tagItem: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  cardAcoes: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
    gap: 8,
  },
  acaoBotao: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: "rgba(17, 17, 19, 0.05)",
  },
});
