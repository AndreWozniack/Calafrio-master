import { Plus, Shield, Sparkles, Trash2 } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";
import type { FichaViva } from "../../types/ficha";
import { CartaoPapel, TituloSecao } from "../ui";

interface InventarioMobileProps {
  f: FichaViva;
  onAdicionarItem: () => void;
}

export function InventarioMobile({
  f,
  onAdicionarItem,
}: InventarioMobileProps) {
  const itens = f.ficha.inventario;

  return (
    <View style={styles.secao}>
      <TituloSecao detalhe={`${itens.length} itens`}>
        Mochila & Inventário
      </TituloSecao>

      <View style={styles.lista}>
        {itens.map((item) => (
          <CartaoPapel key={item.id} style={styles.itemCartao}>
            {/* Botão de Equipado / Guardado */}
            <Pressable
              onPress={() =>
                f.dispatch({ tipo: "alternarEquipadoItem", id: item.id })
              }
              style={[
                styles.botaoEquipado,
                {
                  backgroundColor: item.equipado
                    ? CORES_BASE_CALAFRIO.tintaPreta
                    : "rgba(17, 17, 19, 0.08)",
                },
              ]}
            >
              <Shield
                size={18}
                color={item.equipado ? "#FFFFFF" : "rgba(17, 17, 19, 0.45)"}
              />
              <Text
                style={[
                  styles.textoEquipado,
                  {
                    color: item.equipado ? "#FFFFFF" : "rgba(17, 17, 19, 0.55)",
                  },
                ]}
              >
                {item.equipado ? "Equip." : "Guard."}
              </Text>
            </Pressable>

            {/* Detalhes do Item */}
            <View style={styles.info}>
              <View style={styles.nomeLinha}>
                {item.paranormal ? (
                  <Sparkles size={14} color="#B45309" strokeWidth={2.5} />
                ) : null}
                <Text style={styles.nomeItem} numberOfLines={1}>
                  {item.nome}
                </Text>
              </View>

              {item.dano ? (
                <Text style={styles.danoTexto}>
                  Dano {item.dano} • {item.espectroDano ?? "físico"}
                </Text>
              ) : null}

              {item.descricao ? (
                <Text style={styles.descricaoTexto} numberOfLines={2}>
                  {item.descricao}
                </Text>
              ) : null}
            </View>

            {/* Botão Remover */}
            <Pressable
              onPress={() => f.removerItem(item.id)}
              style={styles.botaoRemover}
              hitSlop={8}
            >
              <Trash2 size={16} color="rgba(17, 17, 19, 0.4)" />
            </Pressable>
          </CartaoPapel>
        ))}

        <Pressable
          onPress={onAdicionarItem}
          style={({ pressed }) => [
            styles.botaoAdicionar,
            { opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Plus
            size={18}
            color={CORES_BASE_CALAFRIO.tintaPreta}
            strokeWidth={2.5}
          />
          <Text style={styles.textoAdicionar}>Novo item na mochila</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  secao: {
    marginBottom: 16,
  },
  lista: {
    gap: 8,
  },
  itemCartao: {
    padding: 0,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  botaoEquipado: {
    width: 48,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: "rgba(17, 17, 19, 0.15)",
  },
  textoEquipado: {
    fontSize: 8,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 2,
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  nomeLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  nomeItem: {
    fontSize: 14,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  danoTexto: {
    fontSize: 10,
    fontWeight: "700",
    color: "#B45309",
    fontStyle: "italic",
    textTransform: "uppercase",
    marginTop: 1,
  },
  descricaoTexto: {
    fontSize: 11,
    color: "rgba(17, 17, 19, 0.65)",
    marginTop: 2,
  },
  botaoRemover: {
    padding: 12,
  },
  botaoAdicionar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(17, 17, 19, 0.35)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 4,
  },
  textoAdicionar: {
    fontSize: 13,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
});
