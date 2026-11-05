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
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";
import { CartaoPapel, EtiquetaCalafrio } from "../ui";
import { styles } from "./SeletorHabilidadeMobile.styles";

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
  const [filtroPersonalidade, setFiltroPersonalidade] = useState<
    PersonalidadeCalafrio | "todas"
  >("todas");

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
                    <EtiquetaCalafrio variante="amarelo">
                      Única
                    </EtiquetaCalafrio>
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
