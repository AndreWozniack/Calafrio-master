import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { type EspectroDeDano, TOKENS_ESPECTRO_DANO } from "@calafrio/tema";
import * as Haptics from "expo-haptics";
import { Heart, Skull, X, Zap } from "lucide-react-native";
import { BotaoPasso, CartaoPapel, EtiquetaCalafrio } from "../ui";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface ModalDanoCuraMobileProps {
  visivel: boolean;
  pvAtual: number;
  paAtual: number;
  onDano: (valor: number, espectro: EspectroDeDano, paMitigar: number) => void;
  onCurarPv: (valor: number) => void;
  onCurarPa: (valor: number) => void;
  onFechar: () => void;
}

type Modo = "dano" | "pv" | "pa";

const ATALHOS = [1, 2, 3, 5, 10];

export function ModalDanoCuraMobile({
  visivel,
  pvAtual,
  paAtual,
  onDano,
  onCurarPv,
  onCurarPa,
  onFechar,
}: ModalDanoCuraMobileProps) {
  const [modo, setModo] = useState<Modo>("dano");
  const [valor, setValor] = useState(1);
  const [espectro, setEspectro] = useState<EspectroDeDano>("fisico");
  const [paMitigar, setPaMitigar] = useState(0);

  const aplicar = () => {
    if (valor <= 0) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    if (modo === "dano") onDano(valor, espectro, paMitigar);
    else if (modo === "pv") onCurarPv(valor);
    else onCurarPa(valor);

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
            <Text style={styles.titulo}>Dano & Recuperação</Text>
            <Pressable onPress={onFechar} hitSlop={8}>
              <X size={22} color={CORES_BASE_CALAFRIO.tintaPreta} />
            </Pressable>
          </View>

          {/* Abas de Modo */}
          <View style={styles.abasModo}>
            <Pressable
              onPress={() => setModo("dano")}
              style={[
                styles.abaItem,
                modo === "dano" && styles.abaItemAtivaDano,
              ]}
            >
              <Skull
                size={16}
                color={modo === "dano" ? "#FFFFFF" : CORES_BASE_CALAFRIO.tintaPreta}
              />
              <Text
                style={[
                  styles.abaTexto,
                  modo === "dano" && styles.abaTextoAtivo,
                ]}
              >
                Dano
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setModo("pv")}
              style={[
                styles.abaItem,
                modo === "pv" && styles.abaItemAtivaPv,
              ]}
            >
              <Heart
                size={16}
                color={modo === "pv" ? "#FFFFFF" : CORES_BASE_CALAFRIO.tintaPreta}
              />
              <Text
                style={[
                  styles.abaTexto,
                  modo === "pv" && styles.abaTextoAtivo,
                ]}
              >
                Curar PV
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setModo("pa")}
              style={[
                styles.abaItem,
                modo === "pa" && styles.abaItemAtivaPa,
              ]}
            >
              <Zap
                size={16}
                color={modo === "pa" ? "#FFFFFF" : CORES_BASE_CALAFRIO.tintaPreta}
              />
              <Text
                style={[
                  styles.abaTexto,
                  modo === "pa" && styles.abaTextoAtivo,
                ]}
              >
                Curar PA
              </Text>
            </Pressable>
          </View>

          {/* Ajuste de Valor */}
          <View style={styles.valorLinha}>
            <BotaoPasso
              sentido="menos"
              tamanho={44}
              onPress={() => setValor((v) => Math.max(1, v - 1))}
            />
            <Text style={styles.valorGrande}>{valor}</Text>
            <BotaoPasso
              sentido="mais"
              tamanho={44}
              onPress={() => setValor((v) => v + 1)}
            />
          </View>

          {/* Atalhos rápidos */}
          <View style={styles.atalhosLinha}>
            {ATALHOS.map((n) => (
              <Pressable
                key={n}
                onPress={() => setValor(n)}
                style={[
                  styles.atalhoBotao,
                  valor === n && styles.atalhoBotaoAtivo,
                ]}
              >
                <Text
                  style={[
                    styles.atalhoTexto,
                    valor === n && styles.atalhoTextoAtivo,
                  ]}
                >
                  +{n}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Seleção de Espectro (se dano) */}
          {modo === "dano" ? (
            <View style={styles.blocoEspectro}>
              <Text style={styles.secaoRotulo}>Espectro do Dano</Text>
              <View style={styles.espectrosLinha}>
                {(
                  Object.keys(TOKENS_ESPECTRO_DANO) as EspectroDeDano[]
                ).map((k) => (
                  <Pressable
                    key={k}
                    onPress={() => setEspectro(k)}
                    style={[
                      styles.espectroBotao,
                      espectro === k && styles.espectroBotaoAtivo,
                    ]}
                  >
                    <Text style={styles.espectroEmoji}>
                      {TOKENS_ESPECTRO_DANO[k].emoji}
                    </Text>
                    <Text
                      style={[
                        styles.espectroTexto,
                        espectro === k && styles.espectroTextoAtivo,
                      ]}
                    >
                      {TOKENS_ESPECTRO_DANO[k].rotulo.split(" ")[0]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* Botão Aplicar */}
          <Pressable onPress={aplicar} style={styles.botaoAplicar}>
            <Text style={styles.textoAplicar}>
              {modo === "dano"
                ? `Sofrer ${valor} de Dano`
                : modo === "pv"
                  ? `Recuperar ${valor} PV`
                  : `Recuperar ${valor} PA`}
            </Text>
          </Pressable>
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
    padding: 16,
    borderTopWidth: 3,
    borderTopColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  abasModo: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
  },
  abaItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.3)",
    backgroundColor: "#FFFFFF",
  },
  abaItemAtivaDano: {
    borderColor: "#DC2626",
    backgroundColor: "#DC2626",
  },
  abaItemAtivaPv: {
    borderColor: "#059669",
    backgroundColor: "#059669",
  },
  abaItemAtivaPa: {
    borderColor: "#2563EB",
    backgroundColor: "#2563EB",
  },
  abaTexto: {
    fontSize: 12,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  abaTextoAtivo: {
    color: "#FFFFFF",
  },
  valorLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginVertical: 10,
  },
  valorGrande: {
    fontSize: 42,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    minWidth: 80,
    textAlign: "center",
  },
  atalhosLinha: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  atalhoBotao: {
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.3)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  atalhoBotaoAtivo: {
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  atalhoTexto: {
    fontSize: 12,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  atalhoTextoAtivo: {
    color: "#FFFFFF",
  },
  secaoRotulo: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(17, 17, 19, 0.65)",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  blocoEspectro: {
    marginBottom: 16,
  },
  espectrosLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  espectroBotao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(17, 17, 19, 0.2)",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  espectroBotaoAtivo: {
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "#FEF3C7",
  },
  espectroEmoji: {
    fontSize: 14,
  },
  espectroTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  espectroTextoAtivo: {
    fontWeight: "900",
  },
  botaoAplicar: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  textoAplicar: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
