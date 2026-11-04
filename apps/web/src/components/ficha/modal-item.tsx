"use client";

import {
  type CategoriaItemCalafrio,
  carregarCatalogoCalafrio,
  type EfeitoCalafrio,
  type EspectroDeDano,
  type ItemNaFichaCalafrio,
} from "@calafrio/core";
import { Dices, X } from "lucide-react";
import { useMemo, useState } from "react";
import { EditorEfeitos } from "./editor-efeitos";

interface Props {
  aberto: boolean;
  onSalvar: (item: ItemNaFichaCalafrio) => void;
  onFechar: () => void;
}

const CATEGORIAS: { id: CategoriaItemCalafrio; rotulo: string }[] = [
  { id: "arma_curto", rotulo: "Arma — curto alcance" },
  { id: "arma_longo", rotulo: "Arma — longo alcance" },
  { id: "arma_misto", rotulo: "Arma — misto" },
  { id: "vestimenta", rotulo: "Vestimenta" },
  { id: "consumivel", rotulo: "Consumível" },
  { id: "ferramenta", rotulo: "Ferramenta" },
  { id: "bugiganga", rotulo: "Bugiganga" },
];

const ESPECTROS: EspectroDeDano[] = [
  "fisico",
  "castanho",
  "rubro",
  "ceruleo",
  "alvo",
  "variavel",
];

const campo =
  "mt-1 w-full bg-muted/60 text-xs px-2.5 py-1.5 rounded border border-border normal-case font-normal";
const rotulo = "block text-[10px] font-black uppercase text-muted-foreground";

function numOuUndef(v: string): number | undefined {
  return v === "" ? undefined : Number(v);
}

export function ModalItem({ aberto, onSalvar, onFechar }: Props) {
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] =
    useState<CategoriaItemCalafrio>("arma_curto");
  const [paranormal, setParanormal] = useState(false);
  const [equipado, setEquipado] = useState(true);
  const [dano, setDano] = useState<number | undefined>();
  const [espectro, setEspectro] = useState<EspectroDeDano>("fisico");
  const [alcance, setAlcance] = useState("");
  const [usosMax, setUsosMax] = useState<number | undefined>();
  const [precoFundos, setPrecoFundos] = useState<number | undefined>();
  const [precoEspirions, setPrecoEspirions] = useState<number | undefined>();
  const [propriedades, setPropriedades] = useState("");
  const [descricao, setDescricao] = useState("");
  const [efeitos, setEfeitos] = useState<EfeitoCalafrio[]>([]);

  if (!aberto) return null;

  const ehArma = categoria.startsWith("arma_");

  const aplicarPreset = (id: string) => {
    const a = catalogo.armasMundanas.find((x) => x.id === id);
    if (!a) return;
    setNome(a.categoria);
    setCategoria(
      a.tipoAlcance === "Alcance corpo-a-corpo"
        ? "arma_curto"
        : a.tipoAlcance === "Longo-alcance"
          ? "arma_longo"
          : a.tipoAlcance === "Consumível"
            ? "consumivel"
            : "arma_misto",
    );
    setParanormal(false);
    setDano(a.dano);
    setEspectro(a.espectroDano);
    setPrecoFundos(a.precoFundos);
    setPropriedades(a.propriedades.join("\n"));
    setDescricao(a.exemplos);
  };

  const sortearBugiganga = () => {
    const b =
      catalogo.bugigangas[
        Math.floor(Math.random() * catalogo.bugigangas.length)
      ];
    if (!b) return;
    setNome(b.nome);
    setCategoria("bugiganga");
    setParanormal(false);
  };

  const fechar = () => {
    setNome("");
    setDano(undefined);
    setAlcance("");
    setUsosMax(undefined);
    setPrecoFundos(undefined);
    setPrecoEspirions(undefined);
    setPropriedades("");
    setDescricao("");
    setEfeitos([]);
    setParanormal(false);
    setEquipado(true);
    setEspectro("fisico");
    setCategoria("arma_curto");
    onFechar();
  };

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    const props = propriedades
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    onSalvar({
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nome: nome.trim(),
      categoria,
      paranormal,
      equipado,
      precoFundos,
      precoEspirions,
      dano: ehArma ? dano : undefined,
      espectroDano: ehArma ? espectro : undefined,
      alcance: alcance.trim() || undefined,
      usosAtuais: usosMax,
      usosMax,
      propriedades: props.length ? props : undefined,
      descricao: descricao.trim() || undefined,
      efeitos,
    });
    fechar();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <form
        onSubmit={salvar}
        className="calafrio-card p-5 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="calafrio-tag">NOVO ITEM</span>
          <button type="button" onClick={fechar} aria-label="Fechar">
            <X className="size-4 cursor-pointer" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <select
            defaultValue=""
            onChange={(e) => {
              aplicarPreset(e.target.value);
              e.target.value = "";
            }}
            className="flex-1 min-w-[180px] bg-muted text-xs p-1.5 rounded border border-border"
            aria-label="Preencher a partir do arsenal oficial"
          >
            <option value="">Preencher a partir do arsenal oficial…</option>
            {catalogo.armasMundanas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.categoria} (F$ {a.precoFundos})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={sortearBugiganga}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded border border-border hover:bg-muted cursor-pointer"
          >
            <Dices className="size-3.5" /> Bugiganga d100
          </button>
        </div>

        <label className={rotulo}>
          Nome
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={campo}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className={rotulo}>
            Categoria
            <select
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value as CategoriaItemCalafrio)
              }
              className={campo}
            >
              {CATEGORIAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.rotulo}
                </option>
              ))}
            </select>
          </label>
          <label className={rotulo}>
            Alcance
            <input
              type="text"
              value={alcance}
              onChange={(e) => setAlcance(e.target.value)}
              placeholder="ex.: 9 m"
              className={campo}
            />
          </label>
          {ehArma && (
            <>
              <label className={rotulo}>
                Dano
                <input
                  type="number"
                  min={0}
                  value={dano ?? ""}
                  onChange={(e) => setDano(numOuUndef(e.target.value))}
                  className={campo}
                />
              </label>
              <label className={rotulo}>
                Espectro do dano
                <select
                  value={espectro}
                  onChange={(e) =>
                    setEspectro(e.target.value as EspectroDeDano)
                  }
                  className={campo}
                >
                  {ESPECTROS.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          <label className={rotulo}>
            Usos / disparos máx.
            <input
              type="number"
              min={0}
              value={usosMax ?? ""}
              onChange={(e) => setUsosMax(numOuUndef(e.target.value))}
              className={campo}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className={rotulo}>
              F$
              <input
                type="number"
                min={0}
                value={precoFundos ?? ""}
                onChange={(e) => setPrecoFundos(numOuUndef(e.target.value))}
                className={campo}
              />
            </label>
            <label className={rotulo}>
              E$P
              <input
                type="number"
                min={0}
                value={precoEspirions ?? ""}
                onChange={(e) => setPrecoEspirions(numOuUndef(e.target.value))}
                className={campo}
              />
            </label>
          </div>
        </div>

        <label className={rotulo}>
          Propriedades (uma por linha)
          <textarea
            value={propriedades}
            onChange={(e) => setPropriedades(e.target.value)}
            rows={2}
            className={campo}
          />
        </label>
        <label className={rotulo}>
          Descrição
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={2}
            className={campo}
          />
        </label>

        <div className="flex flex-wrap gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={paranormal}
              onChange={(e) => setParanormal(e.target.checked)}
            />
            Parartefato (paranormal)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={equipado}
              onChange={(e) => setEquipado(e.target.checked)}
            />
            Já equipado
          </label>
        </div>

        <EditorEfeitos efeitos={efeitos} onChange={setEfeitos} />

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={fechar}
            className="px-4 py-2 text-xs font-bold rounded border border-border hover:bg-muted cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!nome.trim()}
            className="px-4 py-2 text-xs font-black rounded bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-40 cursor-pointer"
          >
            Adicionar item
          </button>
        </div>
      </form>
    </div>
  );
}
