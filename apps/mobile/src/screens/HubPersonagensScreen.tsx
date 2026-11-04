import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { FichaCalafrio } from "@calafrio/core";
import { Copy, Plus, Search, Trash2, User, Users } from "lucide-react-native";
import { CartaoPapel, EtiquetaCalafrio } from "../components/ui";
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
  const [novoNome, setNovoNome] = useState("");

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

  const handleCriar = () => {
    const nomeFinal = novoNome.trim() || "Novo Investigador";
    onCriarNovo(nomeFinal);
    setNovoNome("");
    setModalCriar(false);
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
          <Plus size={16} color={CORES_BASE_CALAFRIO.tintaPreta} strokeWidth={3} />
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
              Toque em "Novo Player" acima para iniciar sua investigação no Calafrio.
            </Text>
          </View>
        ) : (
          filtrados.map((p) => (
            <CartaoPapel key={p.id} style={styles.cardPlayer}>
              <Pressable
                onPress={() => onAbrirFicha(p.id)}
                style={styles.cardCorpo}
              >
                {/* Retrato Thumbnail */}
                <View style={styles.retratoContainer}>
                  {p.retratoUrl ? (
                    <Image
                      source={{ uri: p.retratoUrl }}
                      style={styles.retratoImagem}
                    />
                  ) : (
                    <User size={24} color="rgba(17, 17, 19, 0.3)" />
                  )}
                </View>

                {/* Dados do Investigador */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardNome} numberOfLines={1}>
                    {p.nome}
                  </Text>
                  <Text style={styles.cardConceito} numberOfLines={1}>
                    {p.jogador ? `Jogador: ${p.jogador}` : "Investigador"}
                  </Text>
                  <View style={styles.tagsLinha}>
                    <EtiquetaCalafrio style={styles.tagItem}>
                      APT {p.aptBase}
                    </EtiquetaCalafrio>
                    <EtiquetaCalafrio
                      variante="amarelo"
                      style={styles.tagItem}
                    >
                      {p.palavrasChave.length} palavras
                    </EtiquetaCalafrio>
                  </View>
                </View>
              </Pressable>

              {/* Ações do Card */}
              <View style={styles.cardAcoes}>
                <Pressable
                  onPress={() => onDuplicar(p.id)}
                  style={styles.acaoBotao}
                  hitSlop={8}
                >
                  <Copy size={16} color="rgba(17, 17, 19, 0.6)" />
                </Pressable>
                <Pressable
                  onPress={() => confirmarExclusao(p.id, p.nome)}
                  style={styles.acaoBotao}
                  hitSlop={8}
                >
                  <Trash2 size={16} color="#DC2626" />
                </Pressable>
              </View>
            </CartaoPapel>
          ))
        )}
      </ScrollView>

      {/* Modal de Criação Rápida */}
      <Modal
        visible={modalCriar}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCriar(false)}
      >
        <View style={styles.modalFundo}>
          <CartaoPapel style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Criar Novo Investigador</Text>
            <Text style={styles.modalSubtitulo}>
              Digite o nome do seu personagem para começar:
            </Text>

            <TextInput
              autoFocus
              placeholder="Ex: Detetive Souza, Iara Ramos..."
              placeholderTextColor="rgba(17, 17, 19, 0.4)"
              value={novoNome}
              onChangeText={setNovoNome}
              style={styles.modalInput}
              onSubmitEditing={handleCriar}
            />

            <View style={styles.modalBotoes}>
              <Pressable
                onPress={() => {
                  setNovoNome("");
                  setModalCriar(false);
                }}
                style={styles.modalBotaoCancelar}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleCriar} style={styles.modalBotaoConfirmar}>
                <Text style={styles.textoConfirmar}>Criar & Abrir</Text>
              </Pressable>
            </View>
          </CartaoPapel>
        </View>
      </Modal>
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
    textTransform: "uppercase",
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  buscaInput: {
    flex: 1,
    fontSize: 13,
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  lista: {
    flex: 1,
  },
  listaContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 40,
  },
  vazio: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 8,
  },
  textoVazio: {
    fontSize: 15,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  subtextoVazio: {
    fontSize: 12,
    color: "rgba(17, 17, 19, 0.5)",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  cardPlayer: {
    padding: 0,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
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
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "rgba(17, 17, 19, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  retratoImagem: {
    width: "100%",
    height: "100%",
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
    marginBottom: 4,
  },
  tagsLinha: {
    flexDirection: "row",
    gap: 6,
  },
  tagItem: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  cardAcoes: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    gap: 4,
  },
  acaoBotao: {
    padding: 8,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    padding: 16,
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  modalSubtitulo: {
    fontSize: 12,
    color: "rgba(17, 17, 19, 0.65)",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  modalBotoes: {
    flexDirection: "row",
    gap: 8,
  },
  modalBotaoCancelar: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.3)",
    paddingVertical: 10,
    alignItems: "center",
  },
  textoCancelar: {
    fontSize: 12,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  modalBotaoConfirmar: {
    flex: 1,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingVertical: 10,
    alignItems: "center",
  },
  textoConfirmar: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
});
