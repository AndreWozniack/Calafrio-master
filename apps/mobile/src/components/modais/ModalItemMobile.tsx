import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import type {
  CategoriaItemCalafrio,
  EspectroDeDano,
  ItemNaFichaCalafrio,
} from "@calafrio/core";
import { X } from "lucide-react-native";
import { CartaoPapel, EtiquetaCalafrio } from "../ui";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface ModalItemMobileProps {
  visivel: boolean;
  onSalvar: (item: ItemNaFichaCalafrio) => void;
  onFechar: () => void;
}

const CATEGORIAS: { id: CategoriaItemCalafrio; rotulo: string }[] = [
  { id: "bugiganga", rotulo: "Bugiganga" },
  { id: "arma_curto", rotulo: "Arma Curta" },
  { id: "arma_longo", rotulo: "Arma Longa" },
  { id: "ferramenta", rotulo: "Ferramenta" },
  { id: "vestimenta", rotulo: "Vestimenta" },
  { id: "consumivel", rotulo: "Consumível" },
];

export function ModalItemMobile({
  visivel,
  onSalvar,
  onFechar,
}: ModalItemMobileProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaItemCalafrio>("bugiganga");
  const [paranormal, setParanormal] = useState(false);
  const [dano, setDano] = useState("");
  const [descricao, setDescricao] = useState("");

  const salvar = () => {
    if (!nome.trim()) return;
    const danoNum = Number.parseInt(dano, 10);

    const novoItem: ItemNaFichaCalafrio = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nome: nome.trim(),
      categoria,
      paranormal,
      equipado: false,
      dano: Number.isNaN(danoNum) ? undefined : danoNum,
      espectroDano: danoNum ? "fisico" : undefined,
      descricao: descricao.trim() || undefined,
      efeitos: [],
    };

    onSalvar(novoItem);
    setNome("");
    setDano("");
    setDescricao("");
    setParanormal(false);
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
            <Text style={styles.titulo}>Novo Item</Text>
            <Pressable onPress={onFechar} hitSlop={8}>
              <X size={22} color={CORES_BASE_CALAFRIO.tintaPreta} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Nome */}
            <View style={styles.campoBloco}>
              <Text style={styles.rotulo}>Nome do Item *</Text>
              <TextInput
                placeholder="Ex: Lanterna tática, Pistola .38..."
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

            {/* Parartefato / Paranormal */}
            <View style={styles.campoLinha}>
              <View>
                <Text style={styles.rotulo}>Parartefato (Paranormal)</Text>
                <Text style={styles.subrotulo}>
                  Objeto amaldiçoado ou imbuído de ânimum
                </Text>
              </View>
              <Switch
                value={paranormal}
                onValueChange={setParanormal}
                trackColor={{
                  false: "#D1D5DB",
                  true: CORES_BASE_CALAFRIO.amareloCalafrio,
                }}
                thumbColor={
                  paranormal ? CORES_BASE_CALAFRIO.tintaPreta : "#FFFFFF"
                }
              />
            </View>

            {/* Dano (opcional) */}
            <View style={styles.campoBloco}>
              <Text style={styles.rotulo}>Dano (opcional)</Text>
              <TextInput
                placeholder="Ex: 2, 4..."
                placeholderTextColor="rgba(17, 17, 19, 0.4)"
                keyboardType="numeric"
                value={dano}
                onChangeText={setDano}
                style={styles.input}
              />
            </View>

            {/* Descrição */}
            <View style={styles.campoBloco}>
              <Text style={styles.rotulo}>Descrição / Efeito</Text>
              <TextInput
                multiline
                placeholder="Propriedades, munições, detalhes..."
                placeholderTextColor="rgba(17, 17, 19, 0.4)"
                value={descricao}
                onChangeText={setDescricao}
                style={[styles.input, styles.inputMultiline]}
              />
            </View>

            {/* Botão Salvar */}
            <Pressable
              onPress={salvar}
              disabled={!nome.trim()}
              style={[
                styles.botaoSalvar,
                { opacity: nome.trim() ? 1 : 0.5 },
              ]}
            >
              <Text style={styles.textoSalvar}>Adicionar à Mochila</Text>
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
  subrotulo: {
    fontSize: 10,
    color: "rgba(17, 17, 19, 0.5)",
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
  campoLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
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
