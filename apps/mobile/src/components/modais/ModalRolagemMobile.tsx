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
import {
  type FichaDerivadaCalafrio,
  type ModoRolagemD20,
  type ResultadoContestacao,
  type ResultadoTesteAcao,
  rolarContestacao,
  rolarTesteAcao,
} from "@calafrio/core";
import * as Haptics from "expo-haptics";
import { Dices, X } from "lucide-react-native";
import { CartaoPapel, EtiquetaCalafrio } from "../ui";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface ModalRolagemMobileProps {
  visivel: boolean;
  derivada: FichaDerivadaCalafrio;
  palavraChaveInicial?: string;
  onFechar: () => void;
}

const MODOS: { id: ModoRolagemD20; rotulo: string }[] = [
  { id: "normal", rotulo: "Normal" },
  { id: "vantagem", rotulo: "Vantagem" },
  { id: "desvantagem", rotulo: "Desvantagem" },
];

const DIFICULDADES = [
  { valor: 10, rotulo: "Muito simples (10)" },
  { valor: 13, rotulo: "Simples (13)" },
  { valor: 15, rotulo: "Moderado (15)" },
  { valor: 17, rotulo: "Difícil (17)" },
  { valor: 20, rotulo: "Extremo (20+)" },
];

export function ModalRolagemMobile({
  visivel,
  derivada,
  palavraChaveInicial = "",
  onFechar,
}: ModalRolagemMobileProps) {
  const [tipo, setTipo] = useState<"acao" | "contestacao">("acao");
  const [modo, setModo] = useState<ModoRolagemD20>("normal");
  const [dificuldade, setDificuldade] = useState(13);
  const [modificador, setModificador] = useState(0);
  const [palavra, setPalavra] = useState(palavraChaveInicial);
  const [resultado, setResultado] = useState<
    | { tipo: "acao"; dados: ResultadoTesteAcao }
    | { tipo: "contestacao"; dados: ResultadoContestacao }
    | null
  >(null);

  const executarRolagem = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    if (tipo === "acao") {
      const res = rolarTesteAcao({
        apt: derivada.apt,
        modo,
        dificuldade,
        bonusExtra: modificador,
      });
      setResultado({ tipo: "acao", dados: res });
    } else {
      const res = rolarContestacao({
        aptAtacante: derivada.apt,
        modoAtacante: modo,
        bonusAtacante: modificador,
        aptVitima: 1,
        pdVitima: 3,
        modoVitima: "normal",
      });
      setResultado({ tipo: "contestacao", dados: res });
    }
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
              <Dices size={20} color={CORES_BASE_CALAFRIO.tintaPreta} />
              <Text style={styles.titulo}>Rolador de Dados</Text>
            </View>
            <Pressable onPress={onFechar} hitSlop={8} style={styles.botaoFechar}>
              <X size={22} color={CORES_BASE_CALAFRIO.tintaPreta} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Alternador de Tipo */}
            <View style={styles.abasTipo}>
              <Pressable
                onPress={() => {
                  setTipo("acao");
                  setResultado(null);
                }}
                style={[
                  styles.abaBotao,
                  tipo === "acao" && styles.abaBotaoAtivo,
                ]}
              >
                <Text
                  style={[
                    styles.abaTexto,
                    tipo === "acao" && styles.abaTextoAtivo,
                  ]}
                >
                  Teste de Ação
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setTipo("contestacao");
                  setResultado(null);
                }}
                style={[
                  styles.abaBotao,
                  tipo === "contestacao" && styles.abaBotaoAtivo,
                ]}
              >
                <Text
                  style={[
                    styles.abaTexto,
                    tipo === "contestacao" && styles.abaTextoAtivo,
                  ]}
                >
                  Contestação
                </Text>
              </Pressable>
            </View>

            {/* Modo de Rolagem */}
            <Text style={styles.secaoRotulo}>Modo D20</Text>
            <View style={styles.linhaModos}>
              {MODOS.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => setModo(m.id)}
                  style={[
                    styles.modoBotao,
                    modo === m.id && styles.modoBotaoAtivo,
                  ]}
                >
                  <Text
                    style={[
                      styles.modoTexto,
                      modo === m.id && styles.modoTextoAtivo,
                    ]}
                  >
                    {m.rotulo}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Dificuldade (Apenas em Teste de Ação) */}
            {tipo === "acao" ? (
              <View style={styles.campoBloco}>
                <Text style={styles.secaoRotulo}>Dificuldade Alvo</Text>
                <View style={styles.gridDificuldades}>
                  {DIFICULDADES.map((d) => (
                    <Pressable
                      key={d.valor}
                      onPress={() => setDificuldade(d.valor)}
                      style={[
                        styles.difBotao,
                        dificuldade === d.valor && styles.difBotaoAtivo,
                      ]}
                    >
                      <Text
                        style={[
                          styles.difTexto,
                          dificuldade === d.valor && styles.difTextoAtivo,
                        ]}
                      >
                        {d.rotulo}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Modificador Bônus */}
            <View style={styles.campoLinha}>
              <Text style={styles.secaoRotulo}>Bônus / Modificador</Text>
              <View style={styles.ajusteModificador}>
                <Pressable
                  onPress={() => setModificador((v) => v - 1)}
                  style={styles.modPasso}
                >
                  <Text style={styles.modPassoTexto}>-</Text>
                </Pressable>
                <Text style={styles.modValor}>
                  {modificador >= 0 ? `+${modificador}` : modificador}
                </Text>
                <Pressable
                  onPress={() => setModificador((v) => v + 1)}
                  style={styles.modPasso}
                >
                  <Text style={styles.modPassoTexto}>+</Text>
                </Pressable>
              </View>
            </View>

            {/* Botão de Rolar */}
            <Pressable
              onPress={executarRolagem}
              style={({ pressed }) => [
                styles.botaoRolar,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Dices size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.textoRolar}>Rolar Dados</Text>
            </Pressable>

            {/* Painel de Resultado */}
            {resultado ? (
              <View style={styles.resultadoContainer}>
                {resultado.tipo === "acao" ? (
                  <View
                    style={[
                      styles.resultadoBox,
                      resultado.dados.sucesso
                        ? styles.sucessoBox
                        : styles.falhaBox,
                    ]}
                  >
                    <Text
                      style={[
                        styles.resultadoStatus,
                        resultado.dados.sucesso
                          ? styles.sucessoTexto
                          : styles.falhaTexto,
                      ]}
                    >
                      {resultado.dados.sucesso ? "SUCESSO!" : "FALHA!"}
                    </Text>
                    <Text style={styles.resultadoDetalhe}>
                      Total: {resultado.dados.total} (Dado: {resultado.dados.dadoEscolhido}) vs DT {resultado.dados.dificuldade}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.resultadoBox,
                      resultado.dados.vencedor === "atacante"
                        ? styles.sucessoBox
                        : styles.falhaBox,
                    ]}
                  >
                    <Text
                      style={[
                        styles.resultadoStatus,
                        resultado.dados.vencedor === "atacante"
                          ? styles.sucessoTexto
                          : styles.falhaTexto,
                      ]}
                    >
                      {resultado.dados.vencedor === "atacante"
                        ? "VITÓRIA!"
                        : "DERROTA / EMPATE"}
                    </Text>
                    <Text style={styles.resultadoDetalhe}>
                      Atacante: {resultado.dados.totalAtacante} vs Defensor: {resultado.dados.totalEfetivoVitima}
                    </Text>
                  </View>
                )}
              </View>
            ) : null}
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
    maxHeight: "90%",
    padding: 16,
    borderTopWidth: 3,
    borderTopColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(17, 17, 19, 0.15)",
    paddingBottom: 10,
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
  botaoFechar: {
    padding: 4,
  },
  abasTipo: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    marginBottom: 14,
  },
  abaBotao: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  abaBotaoAtivo: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  abaTexto: {
    fontSize: 12,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  abaTextoAtivo: {
    color: "#FFFFFF",
  },
  secaoRotulo: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(17, 17, 19, 0.65)",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  linhaModos: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  modoBotao: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.3)",
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  modoBotaoAtivo: {
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  modoTexto: {
    fontSize: 11,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  modoTextoAtivo: {
    color: "#FFFFFF",
  },
  campoBloco: {
    marginBottom: 14,
  },
  gridDificuldades: {
    gap: 4,
  },
  difBotao: {
    borderWidth: 1,
    borderColor: "rgba(17, 17, 19, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  difBotaoAtivo: {
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "#FEF3C7",
  },
  difTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  difTextoAtivo: {
    fontWeight: "900",
  },
  campoLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  ajusteModificador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modPasso: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    alignItems: "center",
    justifyContent: "center",
  },
  modPassoTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  modValor: {
    fontSize: 18,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    minWidth: 32,
    textAlign: "center",
  },
  botaoRolar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingVertical: 14,
    borderRadius: 4,
    marginBottom: 16,
  },
  textoRolar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultadoContainer: {
    marginTop: 4,
    marginBottom: 20,
  },
  resultadoBox: {
    padding: 14,
    borderWidth: 2,
    alignItems: "center",
  },
  sucessoBox: {
    borderColor: "#059669",
    backgroundColor: "#ECFDF5",
  },
  falhaBox: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  resultadoStatus: {
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  sucessoTexto: {
    color: "#059669",
  },
  falhaTexto: {
    color: "#DC2626",
  },
  resultadoDetalhe: {
    fontSize: 13,
    fontWeight: "700",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
});
