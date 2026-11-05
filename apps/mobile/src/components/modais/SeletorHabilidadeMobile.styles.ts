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
    height: "85%",
    padding: 16,
    borderTopWidth: 3,
    borderTopColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  abasOrigem: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    marginBottom: 10,
  },
  abaOrigemItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  abaOrigemItemAtiva: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  abaOrigemTexto: {
    fontSize: 11,
    fontWeight: "800",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  abaOrigemTextoAtiva: {
    color: "#FFFFFF",
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.3)",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  buscaInput: {
    flex: 1,
    fontSize: 13,
    color: CORES_BASE_CALAFRIO.tintaPreta,
    padding: 0,
    fontWeight: "600",
  },
  filtrosContainer: {
    marginBottom: 12,
    maxHeight: 34,
  },
  filtrosScroll: {
    maxHeight: 38,
    marginBottom: 10,
  },
  filtrosContent: {
    flexDirection: "row",
    gap: 6,
  },
  filtroBotao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(17, 17, 19, 0.2)",
    borderRadius: 2,
    marginRight: 6,
    backgroundColor: "#FFFFFF",
  },
  filtroBotaoAtivo: {
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  filtroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderColor: "rgba(17, 17, 19, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  filtroTagAtiva: {
    borderColor: CORES_BASE_CALAFRIO.tintaPreta,
    backgroundColor: CORES_BASE_CALAFRIO.tintaPreta,
  },
  emoji: {
    fontSize: 12,
  },
  filtroTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: CORES_BASE_CALAFRIO.tintaPreta,
    textTransform: "uppercase",
  },
  filtroTextoAtivo: {
    color: "#FFFFFF",
  },
  listaScroll: {
    flex: 1,
  },
  itemHabilidade: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(17, 17, 19, 0.1)",
    gap: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nomeHabilidade: {
    fontSize: 15,
    fontWeight: "900",
    color: CORES_BASE_CALAFRIO.tintaPreta,
  },
  detalhesHabilidade: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(17, 17, 19, 0.6)",
  },
  descricaoHabilidade: {
    fontSize: 12,
    color: "rgba(17, 17, 19, 0.8)",
    lineHeight: 16,
  },
  vazioContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  vazioTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(17, 17, 19, 0.5)",
    textAlign: "center",
    lineHeight: 18,
  },
});
