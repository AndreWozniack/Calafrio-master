import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useGerenciadorPersonagensAsync } from "@calafrio/ficha-app";
import { StatusBar } from "expo-status-bar";
import { FichaPlayerScreen } from "./src/screens/FichaPlayerScreen";
import { HubPersonagensScreen } from "./src/screens/HubPersonagensScreen";
import { mobileStorageAdapter } from "./src/storage/async-storage-adapter";
import { CORES_BASE_CALAFRIO } from "./src/theme/tokens";

export default function App() {
  const {
    personagens,
    personagemAtivo,
    carregando,
    selecionarPersonagem,
    criarPersonagem,
    salvarPersonagem,
    duplicarPersonagem,
    excluirPersonagem,
  } = useGerenciadorPersonagensAsync(mobileStorageAdapter);

  if (carregando) {
    return (
      <View style={styles.carregandoContainer}>
        <StatusBar style="dark" />
        <Text style={styles.logoCarregando}>CALAFRIO</Text>
        <ActivityIndicator
          size="large"
          color={CORES_BASE_CALAFRIO.tintaPreta}
          style={styles.spinner}
        />
        <Text style={styles.textoCarregando}>Carregando investigadores...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      {personagemAtivo ? (
        <FichaPlayerScreen
          key={personagemAtivo.id}
          fichaInicial={personagemAtivo}
          onVoltar={() => selecionarPersonagem(null)}
          onSalvar={salvarPersonagem}
        />
      ) : (
        <HubPersonagensScreen
          personagens={personagens}
          onCriarNovo={(nome) => {
            const novo = criarPersonagem(nome);
            selecionarPersonagem(novo.id);
          }}
          onAbrirFicha={(id) => selecionarPersonagem(id)}
          onDuplicar={(id) => duplicarPersonagem(id)}
          onExcluir={(id) => excluirPersonagem(id)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CORES_BASE_CALAFRIO.papelFundo,
  },
  carregandoContainer: {
    flex: 1,
    backgroundColor: CORES_BASE_CALAFRIO.papelFundo,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCarregando: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 4,
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  spinner: {
    marginVertical: 16,
  },
  textoCarregando: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.5)",
    textTransform: "uppercase",
  },
});
