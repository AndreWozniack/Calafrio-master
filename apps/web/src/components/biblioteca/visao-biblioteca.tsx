"use client";

import React, { useMemo, useState } from "react";
import { carregarCatalogoCalafrio } from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { Search, Dices, FileText, BookOpen, Swords, Sparkles, ExternalLink } from "lucide-react";

export function VisaoBiblioteca() {
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);

  const [abaAtiva, setAbaAtiva] = useState<
    "habilidades" | "tabelas" | "arsenal" | "glossario" | "pdfs"
  >("habilidades");

  // Filtros de Habilidades
  const [busca, setBusca] = useState("");
  const [filtroPersonalidade, setFiltroPersonalidade] = useState<string>("todas");
  const [filtroDominio, setFiltroDominio] = useState<string>("todos");

  // Sorteadores
  const [itemSorteado, setItemSorteado] = useState<string | null>(null);

  // PDF Selecionado
  const [pdfAtivo, setPdfAtivo] = useState<string>("/assets/calafrio/2e-V1HabilidadesParanormais_Calafrio.pdf");

  const habilidadesFiltradas = catalogo.habilidadesParanormais.filter((h) => {
    if (filtroPersonalidade !== "todas" && h.personalidade !== filtroPersonalidade) return false;
    if (filtroDominio !== "todos" && h.dominio !== filtroDominio) return false;
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      const matchNome = h.nome.toLowerCase().includes(termo);
      const matchDesc = h.descricao.toLowerCase().includes(termo);
      if (!matchNome && !matchDesc) return false;
    }
    return true;
  });

  const sortearTabela = (tipo: "ocupacoes" | "palavras" | "bugigangas") => {
    let lista: readonly { numero: number; nome: string }[];
    let rotulo: string;
    if (tipo === "ocupacoes") {
      lista = catalogo.ocupacoes;
      rotulo = "Ocupação";
    } else if (tipo === "palavras") {
      lista = catalogo.palavrasChaveGenericas;
      rotulo = "Palavra-chave";
    } else {
      lista = catalogo.bugigangas;
      rotulo = "Bugiganga";
    }
    const idx = Math.floor(Math.random() * lista.length);
    const item = lista[idx];
    setItemSorteado(`🎲 [d100 = ${item.numero}] ${rotulo}: "${item.nome}"`);
  };

  return (
    <div className="space-y-6">
      {/* Navegação de Abas da Biblioteca */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-border rounded-md shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAbaAtiva("habilidades")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "habilidades" ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ✨ 60 Habilidades
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("tabelas")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "tabelas" ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            🎲 Tabelas d100
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("arsenal")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "arsenal" ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚔️ Arsenal & Suporte
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("glossario")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "glossario" ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            📖 Glossário
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("pdfs")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "pdfs" ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            📑 PDFs Oficiais
          </button>
        </div>
      </div>

      {/* ABA 1: HABILIDADES PARANORMAIS */}
      {abaAtiva === "habilidades" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 calafrio-card p-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar habilidade ou efeito..."
                className="w-full bg-muted/60 pl-9 pr-3 py-2 rounded text-xs border border-border"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={filtroPersonalidade}
                onChange={(e) => setFiltroPersonalidade(e.target.value)}
                className="bg-muted p-2 rounded border border-border"
              >
                <option value="todas">Todas Personalidades</option>
                {Object.entries(TOKENS_PERSONALIDADE).map(([key, t]) => (
                  <option key={key} value={key}>
                    {t.emoji} {t.nome}
                  </option>
                ))}
              </select>

              <select
                value={filtroDominio}
                onChange={(e) => setFiltroDominio(e.target.value)}
                className="bg-muted p-2 rounded border border-border"
              >
                <option value="todos">Todos os Domínios</option>
                <option value="positivo">Domínio Positivo</option>
                <option value="negativo">Domínio Negativo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {habilidadesFiltradas.map((hab) => {
              const token = TOKENS_PERSONALIDADE[hab.personalidade];
              const cor = hab.dominio === "positivo" ? token.corPositiva : token.corNegativa;
              return (
                <div
                  key={hab.id}
                  style={{ borderTopColor: cor, borderTopWidth: 4 }}
                  className="calafrio-card p-4 flex flex-col justify-between space-y-2.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-base text-foreground">{hab.nome}</span>
                      <span
                        style={{ backgroundColor: cor }}
                        className="text-[9px] text-white font-extrabold px-1.5 py-0.5 rounded-xs"
                      >
                        {token.nome} ({hab.dominio})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                      <span className="capitalize">{hab.tipoAcao}</span>
                      {hab.tempoPreparacao && <span>({hab.tempoPreparacao})</span>}
                      <span>·</span>
                      <span className="font-bold text-amber-400">
                        {hab.custoPA === 0 ? "Passiva" : `${hab.custoPA} PA`}
                      </span>
                      {hab.requerFoco !== "nao" && <span className="text-amber-300">· 🔒 Foco</span>}
                    </div>

                    <p className="text-xs text-foreground/80 mt-2 leading-relaxed">
                      {hab.descricao}
                    </p>
                  </div>

                  <div className="text-[10px] text-muted-foreground pt-2 border-t border-border flex justify-between">
                    <span>{hab.alcance ?? "Toque / Pessoal"}</span>
                    <span>{hab.duracao ?? "Instantâneo"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 2: TABELAS D100 */}
      {abaAtiva === "tabelas" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 calafrio-card p-4">
            <span className="calafrio-tag">SORTEADOR D100:</span>
            <button
              type="button"
              onClick={() => sortearTabela("ocupacoes")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-black font-bold text-xs rounded cursor-pointer"
            >
              <Dices className="size-3.5" /> Sortear Ocupação
            </button>
            <button
              type="button"
              onClick={() => sortearTabela("palavras")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-black font-bold text-xs rounded cursor-pointer"
            >
              <Dices className="size-3.5" /> Sortear Palavra-chave
            </button>
            <button
              type="button"
              onClick={() => sortearTabela("bugigangas")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-black font-bold text-xs rounded cursor-pointer"
            >
              <Dices className="size-3.5" /> Sortear Bugiganga
            </button>
          </div>

          {itemSorteado && (
            <div className="p-3 bg-amber-500/15 border border-amber-500/50 rounded font-black text-sm text-amber-300 animate-in fade-in">
              {itemSorteado}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ocupações */}
            <div className="calafrio-card p-4 space-y-2">
              <span className="calafrio-tag-sm">100 OCUPAÇÕES</span>
              <div className="max-h-96 overflow-y-auto space-y-1 text-xs pr-1">
                {catalogo.ocupacoes.map((item) => (
                  <div key={item.numero} className="flex gap-2 py-1 border-b border-border/40">
                    <span className="w-7 font-black text-amber-400 shrink-0">{item.numero}.</span>
                    <span>{item.nome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Palavras-chave Genéricas */}
            <div className="calafrio-card p-4 space-y-2">
              <span className="calafrio-tag-sm">100 PALAVRAS-CHAVE</span>
              <div className="max-h-96 overflow-y-auto space-y-1 text-xs pr-1">
                {catalogo.palavrasChaveGenericas.map((item) => (
                  <div key={item.numero} className="flex gap-2 py-1 border-b border-border/40">
                    <span className="w-7 font-black text-amber-400 shrink-0">{item.numero}.</span>
                    <span>{item.nome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bugigangas */}
            <div className="calafrio-card p-4 space-y-2">
              <span className="calafrio-tag-sm">100 BUGIGANGAS</span>
              <div className="max-h-96 overflow-y-auto space-y-1 text-xs pr-1">
                {catalogo.bugigangas.map((item) => (
                  <div key={item.numero} className="flex gap-2 py-1 border-b border-border/40">
                    <span className="w-7 font-black text-amber-400 shrink-0">{item.numero}.</span>
                    <span>{item.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: ARSENAL & TABELAS DE SUPORTE */}
      {abaAtiva === "arsenal" && (
        <div className="space-y-6">
          <div className="calafrio-card p-4 space-y-3">
            <span className="calafrio-tag">TABELA DE ARMAS MUNDANAS (ARSENAL)</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase">
                    <th className="py-2 pr-3">Categoria</th>
                    <th className="py-2 pr-3">Tipo</th>
                    <th className="py-2 pr-3">Preço</th>
                    <th className="py-2 pr-3">Dano</th>
                    <th className="py-2 pr-3">Exemplos</th>
                    <th className="py-2">Propriedades</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {catalogo.armasMundanas.map((arma) => (
                    <tr key={arma.id} className="hover:bg-muted/30">
                      <td className="py-2 font-bold text-foreground">{arma.categoria}</td>
                      <td className="py-2 text-muted-foreground">{arma.tipoAlcance}</td>
                      <td className="py-2 font-bold text-amber-400">{arma.precoFundos} F$</td>
                      <td className="py-2 font-black">{arma.dano}</td>
                      <td className="py-2 text-muted-foreground">{arma.exemplos}</td>
                      <td className="py-2 text-[11px] text-foreground/80">{arma.propriedades.join(" ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="calafrio-card p-4 space-y-2">
              <span className="calafrio-tag-sm">FAMILIARES (1d6)</span>
              <div className="space-y-2 text-xs">
                {catalogo.familiares.map((f) => (
                  <div key={f.dado} className="p-2 rounded bg-muted/40 border border-border">
                    <div className="font-bold text-amber-300">{f.dado}. {f.nome}</div>
                    <p className="text-[11px] text-foreground/80 mt-1">{f.propriedades}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="calafrio-card p-4 space-y-2">
              <span className="calafrio-tag-sm">LACAIOS (1d6)</span>
              <div className="space-y-2 text-xs">
                {catalogo.lacaios.map((l) => (
                  <div key={l.dado} className="p-2 rounded bg-muted/40 border border-border">
                    <div className="font-bold text-amber-300">{l.dado}. {l.nome}</div>
                    <div className="text-[10px] text-muted-foreground font-bold">{l.pv} PV · {l.pd} PD · +{l.aptBonus} APT · {l.velocidade}m VEL</div>
                    <p className="text-[11px] text-foreground/80 mt-1">{l.propriedades}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="calafrio-card p-4 space-y-2">
              <span className="calafrio-tag-sm">DJANHOS (1d6)</span>
              <div className="space-y-2 text-xs">
                {catalogo.djanhos.map((d) => (
                  <div key={d.dado} className="p-2 rounded bg-muted/40 border border-border">
                    <div className="font-bold text-amber-300">{d.dado}. {d.nome}</div>
                    <p className="text-[11px] text-foreground/80 mt-1">{d.propriedades}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: GLOSSÁRIO */}
      {abaAtiva === "glossario" && (
        <div className="calafrio-card p-4 space-y-3">
          <span className="calafrio-tag">GLOSSÁRIO OFICIAL — CALAFRIO 2E</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {catalogo.glossario.map((g) => (
              <div key={g.termo} className="p-3 rounded bg-muted/30 border border-border">
                <div className="font-black text-sm text-amber-400 mb-1">{g.termo}</div>
                <p className="text-xs text-foreground/80 leading-relaxed">{g.definicao}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 5: LEITOR DE PDFS OFICIAIS */}
      {abaAtiva === "pdfs" && (
        <div className="calafrio-card p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <span className="calafrio-tag">DOCUMENTOS OFICIAIS (PDF)</span>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPdfAtivo("/assets/calafrio/2e-V1HabilidadesParanormais_Calafrio.pdf")}
                className={`px-3 py-1.5 rounded cursor-pointer ${
                  pdfAtivo.includes("Habilidades") ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground"
                }`}
              >
                Habilidades Paranormais
              </button>
              <button
                type="button"
                onClick={() => setPdfAtivo("/assets/calafrio/2e-V1FichaConsulta_Calafrio.pdf")}
                className={`px-3 py-1.5 rounded cursor-pointer ${
                  pdfAtivo.includes("Consulta") ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground"
                }`}
              >
                Ficha de Consulta Rápida
              </button>
              <button
                type="button"
                onClick={() => setPdfAtivo("/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf")}
                className={`px-3 py-1.5 rounded cursor-pointer ${
                  pdfAtivo.includes("FichaPersonagem") ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground"
                }`}
              >
                Ficha de Personagem
              </button>
              <a
                href={pdfAtivo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-muted hover:bg-border rounded text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ExternalLink className="size-3.5" /> Abrir em Nova Aba
              </a>
            </div>
          </div>

          <div className="w-full h-[750px] border border-border rounded overflow-hidden bg-black/40">
            <iframe
              src={pdfAtivo}
              className="w-full h-full border-0"
              title="Leitor de PDF Oficial Calafrio"
            />
          </div>
        </div>
      )}
    </div>
  );
}
