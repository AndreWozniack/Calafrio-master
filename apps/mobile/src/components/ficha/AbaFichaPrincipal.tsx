import React from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import type { FichaViva } from "../../types/ficha";
import { CartaoPapel, ChecklistPendencias, TituloSecao } from "../ui";
import { PainelVitaisMobile } from "./PainelVitaisMobile";
import { PalavrasChaveMobile } from "./PalavrasChaveMobile";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface AbaFichaPrincipalProps {
  f: FichaViva;
  onRolarPalavra: (nome: string) => void;
  onAdicionarPalavra: () => void;
  onNavegarAba?: (aba: "ficha" | "mochila" | "matriz") => void;
}

export function AbaFichaPrincipal({
  f,
  onRolarPalavra,
  onAdicionarPalavra,
  onNavegarAba,
}: AbaFichaPrincipalProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Checklist de Pendências da Ficha */}
      <ChecklistPendencias
        ficha={f.ficha}
        onNavegarAba={onNavegarAba}
      />

      {/* Grid de Vitais */}
      <PainelVitaisMobile f={f} />

      {/* Lista de Palavras-Chave */}
      <PalavrasChaveMobile
        f={f}
        onRolar={onRolarPalavra}
        onAdicionar={onAdicionarPalavra}
      />

      {/* Anotações e Cicatrizes */}
      <View style={styles.secao}>
        <TituloSecao>Anotações & Cicatrizes</TituloSecao>
        <CartaoPapel style={styles.cartaoAnotacoes}>
          <TextInput
            multiline
            placeholder="Registre marcas de combate, pistas, contatos ou pendências da investigação..."
            placeholderTextColor="rgba(17, 17, 19, 0.4)"
            value={f.ficha.anotacoes ?? ""}
            onChangeText={(texto) =>
              f.dispatch({ tipo: "definirAnotacoes", anotacoes: texto })
            }
            style={styles.inputAnotacoes}
          />
        </CartaoPapel>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 40,
  },
  secao: {
    marginBottom: 20,
  },
  cartaoAnotacoes: {
    minHeight: 100,
    padding: 10,
  },
  inputAnotacoes: {
    fontSize: 13,
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textAlignVertical: "top",
    lineHeight: 18,
  },
});
