import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";
import { CartaoPapel } from "../ui";

interface ModalCriarPersonagemProps {
  visivel: boolean;
  onFechar: () => void;
  onConfirmar: (nome: string) => void;
}

export function ModalCriarPersonagem({
  visivel,
  onFechar,
  onConfirmar,
}: ModalCriarPersonagemProps) {
  const [novoNome, setNovoNome] = useState("");

  const handleCriar = () => {
    const nomeFinal = novoNome.trim() || "Novo Investigador";
    onConfirmar(nomeFinal);
    setNovoNome("");
    onFechar();
  };

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
    >
      <View style={styles.modalFundo}>
        <CartaoPapel style={styles.modalCard}>
          <Text style={styles.modalTitulo}>Criar Novo Investigador</Text>
          <Text style={styles.modalSubtitulo}>
            Digite o nome do seu personagem para começar:
          </Text>

          <TextInput
            autoFocus
            placeholder="Ex: Detetive Souza, Iara Ramos..."
            placeholderTextColor="rgba(17, 17, 19, 0.4)"
            value={novoNome}
            onChangeText={setNovoNome}
            style={styles.modalInput}
            onSubmitEditing={handleCriar}
          />

          <View style={styles.modalBotoes}>
            <Pressable
              onPress={() => {
                setNovoNome("");
                onFechar();
              }}
              style={styles.modalBotaoCancelar}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={handleCriar} style={styles.modalBotaoConfirmar}>
              <Text style={styles.textoConfirmar}>Criar & Abrir</Text>
            </Pressable>
          </View>
        </CartaoPapel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    letterSpacing: 0.5,
  },
  modalSubtitulo: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(17, 17, 19, 0.6)",
    marginTop: 4,
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "700",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    marginBottom: 16,
  },
  modalBotoes: {
    flexDirection: "row",
    gap: 10,
  },
  modalBotaoCancelar: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.3)",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  textoCancelar: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.7)",
  },
  modalBotaoConfirmar: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  textoConfirmar: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
