import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";
import type { FichaViva } from "../../types/ficha";
import { CartaoPapel, EtiquetaCalafrio, TituloSecao } from "../ui";

interface CarteiraMobileProps {
  f: FichaViva;
}

export function CarteiraMobile({ f }: CarteiraMobileProps) {
  const { fundos, espirions } = f.ficha.carteira;

  const handleFundos = (valor: string) => {
    const n = Number.parseInt(valor, 10);
    f.definirCarteira(Number.isNaN(n) ? 0 : n, espirions);
  };

  const handleEspirions = (valor: string) => {
    const n = Number.parseInt(valor, 10);
    f.definirCarteira(fundos, Number.isNaN(n) ? 0 : n);
  };

  return (
    <View style={styles.secao}>
      <TituloSecao>Carteira & Recursos</TituloSecao>
      <View style={styles.linha}>
        <CartaoPapel style={styles.blocoMoeda}>
          <EtiquetaCalafrio>F$ (Fundos)</EtiquetaCalafrio>
          <TextInput
            keyboardType="numeric"
            value={String(fundos)}
            onChangeText={handleFundos}
            style={styles.inputMoeda}
          />
        </CartaoPapel>

        <CartaoPapel style={styles.blocoMoeda}>
          <EtiquetaCalafrio variante="amarelo">
            E$P (Espírions)
          </EtiquetaCalafrio>
          <TextInput
            keyboardType="numeric"
            value={String(espirions)}
            onChangeText={handleEspirions}
            style={styles.inputMoeda}
          />
        </CartaoPapel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  secao: {
    marginBottom: 16,
  },
  linha: {
    flexDirection: "row",
    gap: 8,
  },
  blocoMoeda: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputMoeda: {
    fontSize: 20,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textAlign: "right",
    minWidth: 50,
  },
});
