import { StyleSheet } from "react-native";
import { CORES_BASE_CALAFRIO } from "../../theme/tokens";

export const styles = StyleSheet.create({
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(17, 17, 19, 0.15)",
    paddingBottom: 10,
  },
  headerTitulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  botaoFechar: {
    padding: 4,
  },
  abasTipo: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    marginBottom: 14,
  },
  abaBotao: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  abaBotaoAtivo: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  abaTexto: {
    fontSize: 12,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  abaTextoAtivo: {
    color: "#FFFFFF",
  },
  secaoRotulo: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(17, 17, 19, 0.65)",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  linhaModos: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  modoBotao: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.3)",
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  modoBotaoAtivo: {
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  modoTexto: {
    fontSize: 11,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  modoTextoAtivo: {
    color: "#FFFFFF",
  },
  campoBloco: {
    marginBottom: 14,
  },
  gridDificuldades: {
    gap: 4,
  },
  difBotao: {
    borderWidth: 1,
    borderColor: "rgba(17, 17, 19, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  difBotaoAtivo: {
    borderWidth: 2,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: "#FEF3C7",
  },
  difTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  difTextoAtivo: {
    fontWeight: "900",
  },
  campoLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  ajusteModificador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modPasso: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    alignItems: "center",
    justifyContent: "center",
  },
  modPassoTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  modValor: {
    fontSize: 18,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    minWidth: 32,
    textAlign: "center",
  },
  botaoRolar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    paddingVertical: 14,
    borderRadius: 4,
    marginBottom: 16,
  },
  textoRolar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultadoContainer: {
    marginTop: 4,
    marginBottom: 20,
  },
  resultadoBox: {
    padding: 14,
    borderWidth: 2,
    alignItems: "center",
  },
  sucessoBox: {
    borderColor: "#059669",
    backgroundColor: "#ECFDF5",
  },
  falhaBox: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  resultadoStatus: {
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  sucessoTexto: {
    color: "#059669",
  },
  falhaTexto: {
    color: "#DC2626",
  },
  resultadoDetalhe: {
    fontSize: 13,
    fontWeight: "700",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
});
