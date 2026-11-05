import type {
  CategoriaPalavraChave,
  PalavraChaveNaFicha,
} from "@calafrio/core";
import { X } from "lucide-react-native";
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
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";
import { CartaoPapel } from "../ui";

interface ModalPalavraChaveMobileProps {
  visivel: boolean;
  onSalvar: (palavra: PalavraChaveNaFicha) => void;
  onFechar: () => void;
}

const CATEGORIAS: { id: CategoriaPalavraChave; rotulo: string }[] = [
  { id: "ocupacao", rotulo: "Ocupação" },
  { id: "talento", rotulo: "Talento" },
  { id: "falha", rotulo: "Falha / Fraqueza" },
  { id: "extra", rotulo: "Extra" },
];

export function ModalPalavraChaveMobile({
  visivel,
  onSalvar,
  onFechar,
}: ModalPalavraChaveMobileProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaPalavraChave>("talento");
  const [notas, setNotas] = useState("");

  const salvar = () => {
    if (!nome.trim()) return;

    const nova: PalavraChaveNaFicha = {
      id: `pc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nome: nome.trim(),
      categoria,
      semConsumirLimite: false,
      notas: notas.trim() || undefined,
      efeitos: [],
    };

    onSalvar(nova);
    setNome("");
    setNotas("");
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
            <Text style={styles.titulo}>Nova Palavra-Chave</Text>
            <Pressable onPress={onFechar} hitSlop={8}>
              <X size={22} color={CORES_BASE_CALAFRIO.tintaPreta} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Nome */}
            <View style={styles.campoBloco}>
              <Text style={styles.rotulo}>Nome da Palavra-Chave *</Text>
              <TextInput
                placeholder="Ex: Medicina Forense, Mira Firme, Paranoia..."
                placeholderTextColor="rgba(17, 17, 19, 0.4)"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
              />
            </View>

            {/* Categoria */}
            <View style={styles.campoBloco}>
              <Text style={styles.rotulo}>Categoria</Text>
              <View style={styles.categoriaGrid}>
                {CATEGORIAS.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategoria(cat.id)}
                    style={[
                      styles.catBotao,
                      categoria === cat.id && styles.catBotaoAtivo,
                    ]}
                  >
                    <Text
                      style={[
                        styles.catTexto,
                        categoria === cat.id && styles.catTextoAtivo,
                      ]}
                    >
                      {cat.rotulo}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Notas / Gatilhos */}
            <View style={styles.campoBloco}>
              <Text style={styles.rotulo}>Notas / Quando aplicar</Text>
              <TextInput
                multiline
                placeholder="Ex: Concede bônus em cenas de investigação de pistas..."
                placeholderTextColor="rgba(17, 17, 19, 0.4)"
                value={notas}
                onChangeText={setNotas}
                style={[styles.input, styles.inputMultiline]}
              />
            </View>

            {/* Botão Salvar */}
            <Pressable
              onPress={salvar}
              disabled={!nome.trim()}
              style={[styles.botaoSalvar, { opacity: nome.trim() ? 1 : 0.5 }]}
            >
              <Text style={styles.textoSalvar}>Adicionar Palavra-Chave</Text>
            </Pressable>
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
  campoBloco: {
    marginBottom: 14,
  },
  rotulo: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(17, 17, 19, 0.7)",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "#FFFFFF",
  },
  inputMultiline: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  categoriaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  catBotao: {
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.25)",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  catBotaoAtivo: {
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  catTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  catTextoAtivo: {
    color: "#FFFFFF",
  },
  botaoSalvar: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 20,
  },
  textoSalvar: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
