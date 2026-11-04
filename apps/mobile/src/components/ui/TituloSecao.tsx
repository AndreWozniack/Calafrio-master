import React, { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { EtiquetaCalafrio } from "./EtiquetaCalafrio";

interface TituloSecaoProps {
  children: ReactNode;
  detalhe?: ReactNode;
}

export function TituloSecao({ children, detalhe }: TituloSecaoProps) {
  return (
    <View style={styles.container}>
      <EtiquetaCalafrio>{children}</EtiquetaCalafrio>
      {detalhe ? <Text style={styles.detalhe}>{detalhe}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detalhe: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.6)",
    fontStyle: "italic",
    textTransform: "uppercase",
  },
});
