"use client";

import type { CategoriaItemCalafrio, EspectroDeDano } from "@calafrio/core";
import { EditorEfeitos } from "../editor-efeitos";
import {
  Alternancia,
  Campo,
  classeCampo,
  numeroOuIndefinido,
} from "./campos-modal";
import {
  CATEGORIAS_ITEM,
  ESPECTROS_DANO,
  ehArma,
  type FormItem,
} from "./form-item";

export function FormItemManual({
  valor,
  onChange,
}: {
  valor: FormItem;
  onChange: (mudanca: Partial<FormItem>) => void;
}) {
  const arma = ehArma(valor.categoria);
  return (
    <div className="space-y-4">
      <Campo rotulo="Nome">
        <input
          value={valor.nome}
          onChange={(e) => onChange({ nome: e.target.value })}
          placeholder="Ex.: Lanterna velha"
          className={classeCampo}
        />
      </Campo>

      <Campo rotulo="Categoria">
        <select
          value={valor.categoria}
          onChange={(e) =>
            onChange({ categoria: e.target.value as CategoriaItemCalafrio })
          }
          className={classeCampo}
        >
          {CATEGORIAS_ITEM.map((c) => (
            <option key={c.id} value={c.id}>
              {c.rotulo}
            </option>
          ))}
        </select>
      </Campo>

      {arma && (
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Dano">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={valor.dano ?? ""}
              onChange={(e) =>
                onChange({ dano: numeroOuIndefinido(e.target.value) })
              }
              className={classeCampo}
            />
          </Campo>
          <Campo rotulo="Espectro">
            <select
              value={valor.espectro}
              onChange={(e) =>
                onChange({ espectro: e.target.value as EspectroDeDano })
              }
              className={classeCampo}
            >
              {ESPECTROS_DANO.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </Campo>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Campo rotulo="Alcance">
          <input
            value={valor.alcance}
            onChange={(e) => onChange({ alcance: e.target.value })}
            placeholder="9 m"
            className={classeCampo}
          />
        </Campo>
        <Campo rotulo="Usos máx.">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={valor.usosMax ?? ""}
            onChange={(e) =>
              onChange({ usosMax: numeroOuIndefinido(e.target.value) })
            }
            className={classeCampo}
          />
        </Campo>
        <Campo rotulo="Preço F$">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={valor.precoFundos ?? ""}
            onChange={(e) =>
              onChange({ precoFundos: numeroOuIndefinido(e.target.value) })
            }
            className={classeCampo}
          />
        </Campo>
        <Campo rotulo="Preço E$P">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={valor.precoEspirions ?? ""}
            onChange={(e) =>
              onChange({ precoEspirions: numeroOuIndefinido(e.target.value) })
            }
            className={classeCampo}
          />
        </Campo>
      </div>

      <Campo rotulo="Propriedades (uma por linha)">
        <textarea
          value={valor.propriedades}
          onChange={(e) => onChange({ propriedades: e.target.value })}
          rows={3}
          className={classeCampo}
        />
      </Campo>
      <Campo rotulo="Descrição">
        <textarea
          value={valor.descricao}
          onChange={(e) => onChange({ descricao: e.target.value })}
          rows={3}
          className={classeCampo}
        />
      </Campo>

      <div className="grid gap-2 sm:grid-cols-2">
        <Alternancia
          rotulo="Parartefato (paranormal)"
          marcado={valor.paranormal}
          onChange={(paranormal) => onChange({ paranormal })}
        />
        <Alternancia
          rotulo="Já equipado"
          marcado={valor.equipado}
          onChange={(equipado) => onChange({ equipado })}
        />
      </div>

      <details className="border-2 border-black/30">
        <summary className="min-h-12 cursor-pointer px-3 py-3 text-base font-extrabold">
          Efeitos / modificadores ({valor.efeitos.length})
        </summary>
        <div className="border-t-2 border-black/20 p-3">
          <EditorEfeitos
            efeitos={valor.efeitos}
            onChange={(efeitos) => onChange({ efeitos })}
          />
        </div>
      </details>
    </div>
  );
}
