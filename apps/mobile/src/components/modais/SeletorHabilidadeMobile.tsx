import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type {
  AlocacaoSlotMatriz,
  CatalogoCalafrio,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import {
  type PersonalidadeCalafrio,
  TOKENS_PERSONALIDADE,
} from "@calafrio/tema";
import { Search, Sparkles, UserCheck, X } from "lucide-react-native";
import { CartaoPapel, EtiquetaCalafrio } from "../ui";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface SeletorHabilidadeMobileProps {
  visivel: boolean;
  slot: number;
  catalogo: CatalogoCalafrio;
  habilidadesUnicas: HabilidadeUnicaCalafrio[];
  onAlocar: (slot: number, alocacao: AlocacaoSlotMatriz) => void;
  onFechar: () => void;
}

type OrigemHabilidade = "paranormal" | "unica";

export function SeletorHabilidadeMobile({
  visivel,
  slot,
  catalogo,
  habilidadesUnicas,
  onAlocar,
  onFechar,
}: SeletorHabilidadeMobileProps) {
  const [origem, setOrigem] = useState<OrigemHabilidade>("paranormal");
  const [busca, setBusca] = useState("");
  const [filtroPersonalidade, setFiltroPersonalidade] =
    useState<PersonalidadeCalafrio | "todas">("todas");

  const habilidadesParanormaisFiltradas =
    catalogo.habilidadesParanormais.filter((h) => {
      if (
        filtroPersonalidade !== "todas" &&
        h.personalidade !== filtroPersonalidade
      ) {
        return false;
      }
      if (!busca.trim()) return true;
      const termo = busca.toLowerCase();
      return (
        h.nome.toLowerCase().includes(termo) ||
        h.descricao.toLowerCase().includes(termo) ||
        h.personalidade.toLowerCase().includes(termo)
      );
    });

  const unicasFiltradas = habilidadesUnicas.filter((u) => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase();
    return (
      u.nome.toLowerCase().includes(termo) ||
      u.descricao.toLowerCase().includes(termo)
    );
  });

  const selecionar = (tipo: "paranormal" | "unica", id: string) => {
    onAlocar(slot, { slot, tipo, id });
    onFechar();
  };

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="slide"
      onRequestClose={onFechar}
    >
      <View style={styles.fundo}>
        <CartaoPapel style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerTitulo}>
              <Sparkles size={18} color={CORES_BASE_CALAFRIO.tintaPreta} />
              <Text style={styles.titulo}>Alocar no Slot #{slot + 1}</Text>
            </View>
            <Pressable onPress={onFechar} hitSlop={8}>
              <X size={22} color={CORES_BASE_CALAFRIO.tintaPreta} />
            </Pressable>
          </View>

          {/* Abas de Origem: Paranormais vs Únicas */}
          <View style={styles.abasOrigem}>
            <Pressable
              onPress={() => setOrigem("paranormal")}
              style={[
                styles.abaOrigemItem,
                origem === "paranormal" && styles.abaOrigemItemAtiva,
              ]}
            >
              <Sparkles
                size={14}
                color={
                  origem === "paranormal"
                    ? "#FFFFFF"
                    : CORES_BASE_CALAFRIO.tintaPreta
                }
              />
              <Text
                style={[
                  styles.abaOrigemTexto,
                  origem === "paranormal" && styles.abaOrigemTextoAtiva,
                ]}
              >
                Paranormais
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setOrigem("unica")}
              style={[
                styles.abaOrigemItem,
                origem === "unica" && styles.abaOrigemItemAtiva,
              ]}
            >
              <UserCheck
                size={14}
                color={
                  origem === "unica"
                    ? "#FFFFFF"
                    : CORES_BASE_CALAFRIO.tintaPreta
                }
              />
              <Text
                style={[
                  styles.abaOrigemTexto,
                  origem === "unica" && styles.abaOrigemTextoAtiva,
                ]}
              >
                Únicas ({habilidadesUnicas.length})
              </Text>
            </Pressable>
          </View>

          {/* Campo de Busca */}
          <View style={styles.buscaContainer}>
            <Search size={16} color="rgba(17, 17, 19, 0.45)" />
            <TextInput
              placeholder="Buscar habilidade por nome ou efeito..."
              placeholderTextColor="rgba(17, 17, 19, 0.4)"
              value={busca}
              onChangeText={setBusca}
              style={styles.buscaInput}
            />
          </View>

          {/* Filtro por Personalidade (apenas em paranormais) */}
          {origem === "paranormal" ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtrosScroll}
              contentContainerStyle={styles.filtrosContent}
            >
              <Pressable
                onPress={() => setFiltroPersonalidade("todas")}
                style={[
                  styles.filtroTag,
                  filtroPersonalidade === "todas" && styles.filtroTagAtiva,
                ]}
              >
                <Text
                  style={[
                    styles.filtroTexto,
                    filtroPersonalidade === "todas" && styles.filtroTextoAtivo,
                  ]}
                >
                  Todas
                </Text>
              </Pressable>

              {(
                Object.keys(TOKENS_PERSONALIDADE) as PersonalidadeCalafrio[]
              ).map((p) => {
                const token = TOKENS_PERSONALIDADE[p];
                return (
                  <Pressable
                    key={p}
                    onPress={() => setFiltroPersonalidade(p)}
                    style={[
                      styles.filtroTag,
                      filtroPersonalidade === p && styles.filtroTagAtiva,
                    ]}
                  >
                    <Text style={styles.emoji}>{token.emoji}</Text>
                    <Text
                      style={[
                        styles.filtroTexto,
                        filtroPersonalidade === p && styles.filtroTextoAtivo,
                      ]}
                    >
                      {token.nome}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}

          {/* Lista de Habilidades */}
          <ScrollView
            style={styles.listaScroll}
            showsVerticalScrollIndicator={false}
          >
            {origem === "paranormal" ? (
              habilidadesParanormaisFiltradas.map((h) => {
                const tokenPers = TOKENS_PERSONALIDADE[h.personalidade];
                return (
                  <Pressable
                    key={h.id}
                    onPress={() => selecionar("paranormal", h.id)}
                    style={({ pressed }) => [
                      styles.itemHabilidade,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <View style={styles.itemHeader}>
                      <Text style={styles.nomeHabilidade}>{h.nome}</Text>
                      <EtiquetaCalafrio
                        style={{ backgroundColor: tokenPers.corBorda }}
                      >
                        {tokenPers.nome}
                      </EtiquetaCalafrio>
                    </View>

                    <Text style={styles.detalhesHabilidade}>
                      {h.tipoAcao.toUpperCase()} •{" "}
                      {h.custoPA === 0 ? "PASSIVA" : `${h.custoPA} PA`}
                      {h.alcance ? ` • ${h.alcance}` : ""}
                    </Text>

                    <Text style={styles.descricaoHabilidade} numberOfLines={2}>
                      {h.descricao}
                    </Text>
                  </Pressable>
                );
              })
            ) : unicasFiltradas.length === 0 ? (
              <View style={styles.vazioContainer}>
                <Text style={styles.vazioTexto}>
                  Nenhuma habilidade única cadastrada para este investigador.
                </Text>
              </View>
            ) : (
              unicasFiltradas.map((u) => (
                <Pressable
                  key={u.id}
                  onPress={() => selecionar("unica", u.id)}
                  style={({ pressed }) => [
                    styles.itemHabilidade,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <View style={styles.itemHeader}>
                    <Text style={styles.nomeHabilidade}>{u.nome}</Text>
                    <EtiquetaCalafrio variante="amarelo">Única</EtiquetaCalafrio>
                  </View>

                  <Text style={styles.detalhesHabilidade}>
                    {u.tipoAcao.toUpperCase()} • {u.custo}{" "}
                    {u.recurso.toUpperCase()}
                  </Text>

                  <Text style={styles.descricaoHabilidade} numberOfLines={2}>
                    {u.descricao}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </CartaoPapel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#FFFFFF",
    height: "85%",
    padding: 16,
    borderTopWidth: 3,
    borderTopColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  abasOrigem: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    marginBottom: 10,
  },
  abaOrigemItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  abaOrigemItemAtiva: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  abaOrigemTexto: {
    fontSize: 11,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  abaOrigemTextoAtiva: {
    color: "#FFFFFF",
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  buscaInput: {
    flex: 1,
    fontSize: 13,
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  filtrosScroll: {
    maxHeight: 38,
    marginBottom: 10,
  },
  filtrosContent: {
    flexDirection: "row",
    gap: 6,
  },
  filtroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  filtroTagAtiva: {
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  emoji: {
    fontSize: 12,
  },
  filtroTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  filtroTextoAtivo: {
    color: "#FFFFFF",
  },
  listaScroll: {
    flex: 1,
  },
  itemHabilidade: {
    padding: 12,
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.2)",
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nomeHabilidade: {
    fontSize: 15,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    flex: 1,
  },
  detalhesHabilidade: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.6)",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  descricaoHabilidade: {
    fontSize: 12,
    color: "rgba(17, 17, 19, 0.75)",
    lineHeight: 16,
  },
  vazioContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  vazioTexto: {
    fontSize: 12,
    color: "rgba(17, 17, 19, 0.5)",
    textAlign: "center",
    fontStyle: "italic",
  },
});
