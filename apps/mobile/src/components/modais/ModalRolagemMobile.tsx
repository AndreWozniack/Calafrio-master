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
import { styles } from "./ModalRolagemMobile.styles";

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
            <Pressable
              onPress={onFechar}
              hitSlop={8}
              style={styles.botaoFechar}
            >
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
                      Total: {resultado.dados.total} (Dado:{" "}
                      {resultado.dados.dadoEscolhido}) vs DT{" "}
                      {resultado.dados.dificuldade}
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
                      Atacante: {resultado.dados.totalAtacante} vs Defensor:{" "}
                      {resultado.dados.totalEfetivoVitima}
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
