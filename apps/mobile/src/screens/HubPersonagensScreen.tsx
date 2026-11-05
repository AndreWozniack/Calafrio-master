import type { FichaCalafrio } from "@calafrio/core";
import { Plus, Search, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CartaoPlayerItem } from "../components/hub/CartaoPlayerItem";
import { ModalCriarPersonagem } from "../components/hub/ModalCriarPersonagem";
import { CORES_BASE_CALAFRIO } from "../theme/tokens";

interface HubPersonagensScreenProps {
  personagens: FichaCalafrio[];
  onCriarNovo: (nome: string) => void;
  onAbrirFicha: (id: string) => void;
  onDuplicar: (id: string) => void;
  onExcluir: (id: string) => void;
}

export function HubPersonagensScreen({
  personagens,
  onCriarNovo,
  onAbrirFicha,
  onDuplicar,
  onExcluir,
}: HubPersonagensScreenProps) {
  const [busca, setBusca] = useState("");
  const [modalCriar, setModalCriar] = useState(false);

  const filtrados = personagens.filter((p) => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase();
    const matchNome = p.nome.toLowerCase().includes(termo);
    const matchJogador = (p.jogador ?? "").toLowerCase().includes(termo);
    const matchPalavra = p.palavrasChave.some((pc) =>
      pc.nome.toLowerCase().includes(termo),
    );
    return matchNome || matchJogador || matchPalavra;
  });

  const confirmarExclusao = (id: string, nome: string) => {
    Alert.alert(
      "Excluir Investigador",
      `Tem certeza que deseja apagar a ficha de "${nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onExcluir(id),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Noir */}
      <View style={styles.header}>
        <View>
          <Text style={styles.tituloApp}>CALAFRIO</Text>
          <Text style={styles.subtituloApp}>Fichas dos Investigadores</Text>
        </View>

        <Pressable
          onPress={() => setModalCriar(true)}
          style={({ pressed }) => [
            styles.botaoNovo,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Plus
            size={16}
            color={CORES_BASE_CALAFRIO.tintaPreta}
            strokeWidth={3}
          />
          <Text style={styles.textoNovo}>Novo Player</Text>
        </Pressable>
      </View>

      {/* Barra de Busca */}
      <View style={styles.buscaContainer}>
        <Search size={16} color="rgba(17, 17, 19, 0.45)" />
        <TextInput
          placeholder="Buscar por nome, jogador ou palavra-chave..."
          placeholderTextColor="rgba(17, 17, 19, 0.4)"
          value={busca}
          onChangeText={setBusca}
          style={styles.buscaInput}
        />
      </View>

      {/* Lista de Personagens */}
      <ScrollView
        style={styles.lista}
        contentContainerStyle={styles.listaContent}
        showsVerticalScrollIndicator={false}
      >
        {filtrados.length === 0 ? (
          <View style={styles.vazio}>
            <Users size={36} color="rgba(17, 17, 19, 0.25)" />
            <Text style={styles.textoVazio}>
              Nenhum investigador encontrado.
            </Text>
            <Text style={styles.subtextoVazio}>
              Toque em "Novo Player" acima para iniciar sua investigação no
              Calafrio.
            </Text>
          </View>
        ) : (
          filtrados.map((p) => (
            <CartaoPlayerItem
              key={p.id}
              personagem={p}
              onAbrir={() => onAbrirFicha(p.id)}
              onDuplicar={() => onDuplicar(p.id)}
              onExcluir={() => confirmarExclusao(p.id, p.nome)}
            />
          ))
        )}
      </ScrollView>

      {/* Modal de Criação Rápida */}
      <ModalCriarPersonagem
        visivel={modalCriar}
        onFechar={() => setModalCriar(false)}
        onConfirmar={onCriarNovo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES_BASE_CALAFRIO.papelFundo,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "#FFFFFF",
  },
  tituloApp: {
    fontSize: 22,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    letterSpacing: 2,
  },
  subtituloApp: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.55)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  botaoNovo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: CORES_BASE_CALAFRIO.amareloCalafrio,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  textoNovo: {
    fontSize: 12,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    letterSpacing: 0.5,
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.25)",
  },
  buscaInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    padding: 0,
  },
  lista: {
    flex: 1,
  },
  listaContent: {
    padding: 16,
    gap: 10,
  },
  vazio: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 10,
  },
  textoVazio: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(17, 17, 19, 0.6)",
    textAlign: "center",
  },
  subtextoVazio: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(17, 17, 19, 0.4)",
    textAlign: "center",
    lineHeight: 16,
  },
});
