import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { FichaViva } from "../../types/ficha";
import { BotaoPasso, CartaoPapel, EtiquetaCalafrio } from "../ui";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

interface PainelVitaisMobileProps {
  f: FichaViva;
}

function CartaoVital({
  rotulo,
  legenda,
  children,
}: {
  rotulo: string;
  legenda: string;
  children: React.ReactNode;
}) {
  return (
    <CartaoPapel style={styles.cartao}>
      <EtiquetaCalafrio>{rotulo}</EtiquetaCalafrio>
      <View style={styles.corpoAjuste}>{children}</View>
      <Text style={styles.legenda}>{legenda}</Text>
    </CartaoPapel>
  );
}

function ValorGrande({
  atual,
  max,
}: {
  atual: number | string;
  max?: number;
}) {
  return (
    <View style={styles.valorLinha}>
      <Text style={styles.valorTexto}>{atual}</Text>
      {max !== undefined ? (
        <Text style={styles.valorMaxTexto}> /{max}</Text>
      ) : null}
    </View>
  );
}

export function PainelVitaisMobile({ f }: PainelVitaisMobileProps) {
  const { derivada } = f;

  return (
    <View style={styles.grid}>
      {/* Vida (PV) */}
      <CartaoVital rotulo="Vida (PV)" legenda="= 3 + 3*APT">
        <BotaoPasso
          sentido="menos"
          onPress={() => f.definirPvAtual(derivada.pvAtual - 1)}
        />
        <ValorGrande atual={derivada.pvAtual} max={derivada.pvMax} />
        <BotaoPasso
          sentido="mais"
          onPress={() => f.definirPvAtual(derivada.pvAtual + 1)}
        />
      </CartaoVital>

      {/* Ânimum (PA) */}
      <CartaoVital rotulo="Ânimum (PA)" legenda="= 3 + 3*APT">
        <BotaoPasso
          sentido="menos"
          onPress={() => f.definirPaAtual(derivada.paAtual - 1)}
        />
        <ValorGrande atual={derivada.paAtual} max={derivada.paMax} />
        <BotaoPasso
          sentido="mais"
          onPress={() => f.definirPaAtual(derivada.paAtual + 1)}
        />
      </CartaoVital>

      {/* Aptidão (APT) */}
      <CartaoVital rotulo="Aptidão (APT)" legenda="= nível do personagem">
        <BotaoPasso
          sentido="menos"
          onPress={() => f.definirApt(Math.max(1, f.ficha.aptBase - 1))}
        />
        <ValorGrande atual={f.ficha.aptBase} />
        <BotaoPasso
          sentido="mais"
          onPress={() => f.definirApt(Math.min(6, f.ficha.aptBase + 1))}
        />
      </CartaoVital>

      {/* Defesa (PD) */}
      <CartaoVital rotulo="Defesa (PD)" legenda="= 3*APT + bônus">
        <ValorGrande atual={derivada.pd} />
      </CartaoVital>

      {/* Velocidade */}
      <CartaoVital rotulo="Velocidade" legenda="= 6m base">
        <ValorGrande atual={derivada.velocidade} />
      </CartaoVital>

      {/* Ecos */}
      <CartaoVital rotulo="Ecos" legenda="= APT total">
        <ValorGrande
          atual={derivada.ecosDisponiveis}
          max={derivada.ecosMax}
        />
      </CartaoVital>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  cartao: {
    width: "48.5%",
    padding: 10,
    justifyContent: "space-between",
    minHeight: 100,
  },
  corpoAjuste: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  valorLinha: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  valorTexto: {
    fontSize: 22,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  valorMaxTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.5)",
  },
  legenda: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.55)",
    fontStyle: "italic",
    textAlign: "right",
    textTransform: "uppercase",
  },
});
