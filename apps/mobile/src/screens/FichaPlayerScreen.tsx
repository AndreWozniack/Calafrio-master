import React, { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { FichaCalafrio } from "@calafrio/core";
import { useFichaCalafrio } from "@calafrio/ficha-app";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  Backpack,
  Camera,
  Dices,
  Grid3x3,
  Skull,
  User,
} from "lucide-react-native";
import {
  AbaFichaPrincipal,
  AbaMatriz,
  AbaMochila,
} from "../components/ficha";
import {
  ModalDanoCuraMobile,
  ModalItemMobile,
  ModalPalavraChaveMobile,
  ModalRolagemMobile,
  SeletorHabilidadeMobile,
} from "../components/modais";
import { CORES_BASE_CALAFRIO } from "../theme/tokens";

interface FichaPlayerScreenProps {
  fichaInicial: FichaCalafrio;
  onVoltar: () => void;
  onSalvar: (ficha: FichaCalafrio) => void;
}

type AbaAtiva = "ficha" | "mochila" | "matriz";

const ABAS: { id: AbaAtiva; rotulo: string; Icone: typeof User }[] = [
  { id: "ficha", rotulo: "Ficha", Icone: User },
  { id: "mochila", rotulo: "Mochila", Icone: Backpack },
  { id: "matriz", rotulo: "Matriz", Icone: Grid3x3 },
];

export function FichaPlayerScreen({
  fichaInicial,
  onVoltar,
  onSalvar,
}: FichaPlayerScreenProps) {
  const f = useFichaCalafrio(fichaInicial, onSalvar);
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("ficha");

  // Modais
  const [modalRolagem, setModalRolagem] = useState(false);
  const [palavraChaveRolagem, setPalavraChaveRolagem] = useState<string>("");
  const [modalDanoCura, setModalDanoCura] = useState(false);
  const [modalItem, setModalItem] = useState(false);
  const [modalPalavra, setModalPalavra] = useState(false);
  const [slotSeletor, setSlotSeletor] = useState<number | null>(null);

  // Troca de Retrato com compressão Base64 compacta
  const selecionarRetrato = async () => {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets[0]?.uri) {
        // Redimensiona para max 300px JPEG para não sobrecarregar o JSON
        const manipulada = await ImageManipulator.manipulateAsync(
          resultado.assets[0].uri,
          [{ resize: { width: 300, height: 300 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
        );

        if (manipulada.base64) {
          const dataUrl = `data:image/jpeg;base64,${manipulada.base64}`;
          f.dispatch({ tipo: "definirRetrato", url: dataUrl });
        }
      }
    } catch {}
  };

  const abrirRolagem = (palavra?: string) => {
    setPalavraChaveRolagem(palavra ?? "");
    setModalRolagem(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Superior da Ficha */}
      <View style={styles.header}>
        {/* Linha 1: Voltar + Nome + Botões Rápidos */}
        <View style={styles.headerTop}>
          <Pressable onPress={onVoltar} hitSlop={8} style={styles.botaoVoltar}>
            <ArrowLeft size={22} color={CORES_BASE_CALAFRIO.tintaPreta} />
          </Pressable>

          <View style={styles.nomeContainer}>
            <TextInput
              value={f.ficha.nome}
              onChangeText={(texto) =>
                f.dispatch({ tipo: "definirNome", nome: texto })
              }
              placeholder="Nome do Investigador"
              placeholderTextColor="rgba(17, 17, 19, 0.4)"
              style={styles.inputNome}
            />
            <TextInput
              value={f.ficha.jogador ?? ""}
              onChangeText={(texto) =>
                f.dispatch({ tipo: "definirJogador", jogador: texto })
              }
              placeholder="Jogador / Arquétipo"
              placeholderTextColor="rgba(17, 17, 19, 0.4)"
              style={styles.inputJogador}
            />
          </View>

          {/* Atalhos Rápidos: Dados e Dano/Cura */}
          <View style={styles.atalhos}>
            <Pressable
              onPress={() => abrirRolagem()}
              style={({ pressed }) => [
                styles.botaoAtalho,
                styles.botaoDados,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Dices size={18} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>

            <Pressable
              onPress={() => setModalDanoCura(true)}
              style={({ pressed }) => [
                styles.botaoAtalho,
                styles.botaoDano,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Skull size={18} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        {/* Linha 2: Retrato e Abas de Navegação */}
        <View style={styles.headerBottom}>
          <Pressable
            onPress={selecionarRetrato}
            style={styles.retratoContainer}
          >
            {f.ficha.retratoUrl ? (
              <Image
                source={{ uri: f.ficha.retratoUrl }}
                style={styles.retratoImagem}
              />
            ) : (
              <Camera size={20} color="rgba(17, 17, 19, 0.4)" />
            )}
          </Pressable>

          <View style={styles.abasContainer}>
            {ABAS.map((aba) => {
              const Icone = aba.Icone;
              const ativa = abaAtiva === aba.id;
              return (
                <Pressable
                  key={aba.id}
                  onPress={() => setAbaAtiva(aba.id)}
                  style={[styles.abaItem, ativa && styles.abaItemAtiva]}
                >
                  <Icone
                    size={16}
                    color={
                      ativa ? "#FFFFFF" : "rgba(17, 17, 19, 0.6)"
                    }
                  />
                  <Text
                    style={[styles.abaTexto, ativa && styles.abaTextoAtiva]}
                  >
                    {aba.rotulo}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* Conteúdo da Aba */}
      <View style={styles.conteudo}>
        {abaAtiva === "ficha" && (
          <AbaFichaPrincipal
            f={f}
            onRolarPalavra={(nome) => abrirRolagem(nome)}
            onAdicionarPalavra={() => setModalPalavra(true)}
            onNavegarAba={(aba) => setAbaAtiva(aba)}
          />
        )}
        {abaAtiva === "mochila" && (
          <AbaMochila f={f} onAdicionarItem={() => setModalItem(true)} />
        )}
        {abaAtiva === "matriz" && (
          <AbaMatriz
            f={f}
            onSelecionarSlot={(slot) => setSlotSeletor(slot)}
          />
        )}
      </View>

      {/* Modais Conectados */}
      <ModalRolagemMobile
        visivel={modalRolagem}
        derivada={f.derivada}
        palavraChaveInicial={palavraChaveRolagem}
        onFechar={() => setModalRolagem(false)}
      />

      <ModalDanoCuraMobile
        visivel={modalDanoCura}
        pvAtual={f.derivada.pvAtual}
        paAtual={f.derivada.paAtual}
        onDano={(valor, espectro, paMitigar) =>
          f.sofrerDano(valor, espectro, paMitigar)
        }
        onCurarPv={(valor) => f.curarPv(valor)}
        onCurarPa={(valor) => f.curarPa(valor)}
        onFechar={() => setModalDanoCura(false)}
      />

      <ModalItemMobile
        visivel={modalItem}
        onSalvar={(item) => f.adicionarItem(item)}
        onFechar={() => setModalItem(false)}
      />

      <ModalPalavraChaveMobile
        visivel={modalPalavra}
        onSalvar={(palavra) => f.adicionarPalavraChave(palavra)}
        onFechar={() => setModalPalavra(false)}
      />

      {slotSeletor !== null && (
        <SeletorHabilidadeMobile
          visivel={slotSeletor !== null}
          slot={slotSeletor}
          catalogo={f.catalogo}
          habilidadesUnicas={f.ficha.habilidadesUnicas}
          onAlocar={(slot, alocacao) =>
            f.alocarSlotMatriz(slot, alocacao.tipo, alocacao.id)
          }
          onFechar={() => setSlotSeletor(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES_BASE_CALAFRIO.papelFundo,
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderBottomColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  botaoVoltar: {
    padding: 6,
  },
  nomeContainer: {
    flex: 1,
  },
  inputNome: {
    fontSize: 16,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    padding: 0,
  },
  inputJogador: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(17, 17, 19, 0.6)",
    padding: 0,
    marginTop: 1,
  },
  atalhos: {
    flexDirection: "row",
    gap: 6,
  },
  botaoAtalho: {
    width: 38,
    height: 38,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoDados: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  botaoDano: {
    backgroundColor: "#DC2626",
  },
  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retratoContainer: {
    width: 44,
    height: 44,
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
  abasContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  abaItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  abaItemAtiva: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  abaTexto: {
    fontSize: 12,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  abaTextoAtiva: {
    color: "#FFFFFF",
  },
  conteudo: {
    flex: 1,
  },
});
