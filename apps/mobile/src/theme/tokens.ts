export {
  CORES_BASE_CALAFRIO,
  TOKENS_ESPECTRO_DANO,
  TOKENS_PERSONALIDADE,
} from "@calafrio/tema";

export const ESTILOS_CALAFRIO = {
  bordaPreta: {
    borderColor: "#111113",
    borderWidth: 2,
  },
  sombraSeca: {
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  sombraSuave: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
} as const;
