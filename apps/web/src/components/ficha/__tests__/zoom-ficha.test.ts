import { describe, expect, it } from "vitest";
import {
  CHAVE_STORAGE_ZOOM_FICHA,
  NIVEIS_ZOOM_FICHA,
  obterConfigZoomFicha,
} from "../fichas-tipos";

describe("Configuração de Zoom da Ficha", () => {
  it("contém a chave de persistência correta no localStorage", () => {
    expect(CHAVE_STORAGE_ZOOM_FICHA).toBe("calafrio:ficha:zoom:v1");
  });

  it("oferece 4 níveis determinísticos (90%, 100%, 115%, 130%) com larguras crescentes", () => {
    expect(NIVEIS_ZOOM_FICHA).toHaveLength(4);
    expect(NIVEIS_ZOOM_FICHA.map((n) => n.id)).toEqual(["90", "100", "115", "130"]);

    for (let i = 1; i < NIVEIS_ZOOM_FICHA.length; i++) {
      expect(NIVEIS_ZOOM_FICHA[i].larguraMaximaFolhaPx).toBeGreaterThan(
        NIVEIS_ZOOM_FICHA[i - 1].larguraMaximaFolhaPx,
      );
      expect(NIVEIS_ZOOM_FICHA[i].larguraMaximaUmaPaginaPx).toBeGreaterThan(
        NIVEIS_ZOOM_FICHA[i - 1].larguraMaximaUmaPaginaPx,
      );
    }
  });

  it("retorna o padrão 100% se o nível for nulo ou inválido", () => {
    expect(obterConfigZoomFicha(null).id).toBe("100");
    expect(obterConfigZoomFicha(undefined).id).toBe("100");
    expect(obterConfigZoomFicha("invalido").id).toBe("100");
    expect(obterConfigZoomFicha("130").id).toBe("130");
  });
});
