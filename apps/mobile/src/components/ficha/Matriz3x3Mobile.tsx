import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { AlocacaoSlotMatriz } from "@calafrio/core";
import { Lock, Plus, Trash2, X } from "lucide-react-native";
import type { FichaViva } from "../../types/ficha";
import { CartaoPapel, EtiquetaCalafrio, TituloSecao } from "../ui";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface Matriz3x3MobileProps {
  f: FichaViva;
  onSelecionarSlot: (slot: number) => void;
}

function resumoSlot(f: FichaViva, alocacao?: AlocacaoSlotMatriz) {
  if (!alocacao) return null;
  if (alocacao.tipo === "unica") {
    const u = f.ficha.habilidadesUnicas.find((x) => x.id === alocacao.id);
    return (
      u && {
        nome: u.nome,
        detalhe: `${u.tipoAcao} · ${u.custo} ${u.recurso.toUpperCase()}`,
        descricao: u.descricao,
        id: u.id,
        foco: Boolean(u.requerFoco),
      }
    );
  }
  const h = f.catalogo.habilidadesParanormais.find((x) => x.id === alocacao.id);
  return (
    h && {
      nome: h.nome,
      detalhe: `${h.tipoAcao} · ${h.custoPA === 0 ? "passiva" : `${h.custoPA} PA`}`,
      descricao: h.descricao,
      id: h.id,
      foco: h.requerFoco !== "nao",
    }
  );
}

export function Matriz3x3Mobile({ f, onSelecionarSlot }: Matriz3x3MobileProps) {
  const [aberto, setAberto] = useState<number | null>(null);

  const emAlinhamento = new Set(
    f.derivada.alinhamentosAtivos.flatMap((a) => a.slots),
  );

  const alocacaoDe = (slot: number) =>
    f.ficha.matrizHabilidades.find((m) => m.slot === slot);

  const detalhe = aberto !== null ? resumoSlot(f, alocacaoDe(aberto)) : null;

  return (
    <View style={styles.container}>
      <TituloSecao
        detalhe={`${f.derivada.habilidadesMemorizadasCount}/${f.derivada.limiteHabilidadesMemorizadas} = APT`}
      >
        Matriz 3x3 de Habilidades
      </TituloSecao>

      {/* Grid 3x3 */}
      <View style={styles.grid}>
        {Array.from({ length: 9 }, (_, slot) => {
          const r = resumoSlot(f, alocacaoDe(slot));
          const alinhado = emAlinhamento.has(slot);

          return (
            <Pressable
              key={slot}
              onPress={() => (r ? setAberto(slot) : onSelecionarSlot(slot))}
              style={({ pressed }) => [
                styles.slot,
                alinhado ? styles.slotAlinhado : styles.slotNormal,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <EtiquetaCalafrio
                style={styles.slotTag}
                variante={alinhado ? "amarelo" : "padrao"}
              >
                #{slot + 1}
              </EtiquetaCalafrio>

              {r ? (
                <Text style={styles.nomeHabilidade} numberOfLines={2}>
                  {r.nome}
                </Text>
              ) : (
                <View style={styles.iconeMais}>
                  <Plus size={22} color="rgba(17, 17, 19, 0.25)" strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.regrasAlinhamento}>
        ↔ +3 PA · ↕ +3 PD · ⤢ +6 PV · ⊞ +3 VEL (mesma personalidade)
      </Text>

      {/* Modal / Sheet de Detalhes da Habilidade */}
      {detalhe && aberto !== null ? (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setAberto(null)}
        >
          <View style={styles.modalFundo}>
            <CartaoPapel style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <EtiquetaCalafrio>#{aberto + 1}</EtiquetaCalafrio>
                <Pressable
                  onPress={() => setAberto(null)}
                  style={styles.botaoFechar}
                  hitSlop={8}
                >
                  <X size={22} color={CORES_BASE_CALAFRIO.tintaPreta} />
                </Pressable>
              </View>

              <Text style={styles.modalTitulo}>{detalhe.nome}</Text>
              <Text style={styles.modalDetalhe}>{detalhe.detalhe}</Text>
              <Text style={styles.modalDescricao}>{detalhe.descricao}</Text>

              {detalhe.foco ? (
                <Pressable
                  onPress={() => f.alternarFoco(detalhe.id)}
                  style={[
                    styles.botaoFoco,
                    {
                      backgroundColor:
                        f.estado.focoAtivoId === detalhe.id
                          ? CORES_BASE_CALAFRIO.amareloCalafrio
                          : CORES_BASE_CALAFRIO.tintaPreta,
                    },
                  ]}
                >
                  <Lock
                    size={16}
                    color={
                      f.estado.focoAtivoId === detalhe.id
                        ? CORES_BASE_CALAFRIO.tintaPreta
                        : "#FFFFFF"
                    }
                  />
                  <Text
                    style={[
                      styles.textoFoco,
                      {
                        color:
                          f.estado.focoAtivoId === detalhe.id
                            ? CORES_BASE_CALAFRIO.tintaPreta
                            : "#FFFFFF",
                      },
                    ]}
                  >
                    {f.estado.focoAtivoId === detalhe.id
                      ? "Foco ativo (toque para soltar)"
                      : "Ativar Foco nesta habilidade"}
                  </Text>
                </Pressable>
              ) : null}

              <View style={styles.botoesAcao}>
                <Pressable
                  onPress={() => {
                    const s = aberto;
                    setAberto(null);
                    onSelecionarSlot(s);
                  }}
                  style={styles.botaoTrocar}
                >
                  <Text style={styles.textoTrocar}>Trocar habilidade</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    f.limparSlotMatriz(aberto);
                    setAberto(null);
                  }}
                  style={styles.botaoLimpar}
                >
                  <Trash2 size={16} color="#DC2626" />
                  <Text style={styles.textoLimpar}>Limpar slot</Text>
                </Pressable>
              </View>
            </CartaoPapel>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  slot: {
    width: "31.5%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    padding: 6,
    justifyContent: "space-between",
  },
  slotNormal: {
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.25)",
  },
  slotAlinhado: {
    borderWidth: 2.5,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "#FFFCF2",
  },
  slotTag: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  nomeHabilidade: {
    fontSize: 11,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    lineHeight: 14,
  },
  iconeMais: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  regrasAlinhamento: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.55)",
    textTransform: "uppercase",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  botaoFechar: {
    padding: 4,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    marginBottom: 2,
  },
  modalDetalhe: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(17, 17, 19, 0.6)",
    textTransform: "uppercase",
    fontStyle: "italic",
    marginBottom: 8,
  },
  modalDescricao: {
    fontSize: 13,
    color: CORES_BASE_CALAFRIO.tintaPreta,
    lineHeight: 18,
    marginBottom: 16,
  },
  botaoFoco: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  textoFoco: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  botoesAcao: {
    flexDirection: "row",
    gap: 8,
  },
  botaoTrocar: {
    flex: 1,
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textoTrocar: {
    fontSize: 12,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  botaoLimpar: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#DC2626",
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  textoLimpar: {
    fontSize: 12,
    fontWeight: "900",
    color: "#DC2626",
    textTransform: "uppercase",
  },
});
