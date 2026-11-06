"use client";

import type DiceBox from "@3d-dice/dice-box-threejs";

/**
 * Dados 3D estilo Foundry (motor do Dice So Nice: three.js + cannon-es).
 *
 * O resultado é sempre decidido pelo @calafrio/core; aqui só animamos os
 * dados caindo por cima da página até pararem nas faces já sorteadas.
 * Um único canvas transparente em tela cheia é criado sob demanda e reaproveitado.
 */

const ID_OVERLAY = "calafrio-dados-3d";
const TEMPO_EXIBICAO_MS = 1600;
const TEMPO_FADE_MS = 400;
const TEMPO_LIMITE_ROLAGEM_MS = 8000;

let caixa: Promise<DiceBox | null> | null = null;
let fila: Promise<void> = Promise.resolve();
let timerFade: ReturnType<typeof setTimeout> | undefined;

function criarOverlay(): HTMLDivElement {
  const existente = document.getElementById(ID_OVERLAY);
  if (existente instanceof HTMLDivElement) return existente;
  const div = document.createElement("div");
  div.id = ID_OVERLAY;
  div.setAttribute("aria-hidden", "true");
  Object.assign(div.style, {
    position: "fixed",
    inset: "0",
    zIndex: "9999",
    pointerEvents: "none",
    opacity: "0",
    transition: `opacity ${TEMPO_FADE_MS}ms ease`,
  });
  document.body.appendChild(div);
  return div;
}

function obterCaixa(): Promise<DiceBox | null> {
  caixa ??= (async () => {
    try {
      criarOverlay();
      const { default: DiceBoxClasse } = await import(
        "@3d-dice/dice-box-threejs"
      );
      const box = new DiceBoxClasse(`#${ID_OVERLAY}`, {
        assetPath: "/dados-3d/",
        sounds: true,
        volume: 50,
        shadows: true,
        theme_surface: "green-felt",
        theme_customColorset: {
          name: "calafrio",
          foreground: "#000000",
          background: "#f4f4f2",
          outline: "#000000",
          texture: "none",
          material: "plastic",
        },
        gravity_multiplier: 400,
        light_intensity: 0.8,
        baseScale: 100,
        strength: 1.3,
      });
      await box.initialize();
      return box;
    } catch (erro) {
      // Sem WebGL ou falha de carregamento: segue sem animação.
      console.warn("Dados 3D indisponíveis:", erro);
      return null;
    }
  })();
  return caixa;
}

function preferiuMenosMovimento(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function esperar(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function animar(lados: number, valores: number[]) {
  const box = await obterCaixa();
  if (!box) return;
  const overlay = criarOverlay();

  clearTimeout(timerFade);
  overlay.style.opacity = "1";

  const notacao = `${valores.length}d${lados}@${valores.join(",")}`;
  await Promise.race([box.roll(notacao), esperar(TEMPO_LIMITE_ROLAGEM_MS)]);

  timerFade = setTimeout(() => {
    overlay.style.opacity = "0";
    timerFade = setTimeout(() => box.clearDice(), TEMPO_FADE_MS);
  }, TEMPO_EXIBICAO_MS);
}

/**
 * Lança dados 3D que param exatamente em `valores`.
 * Resolve quando os dados param (o fade acontece depois, sem bloquear).
 * Nunca rejeita: sem suporte a 3D, resolve na hora.
 */
export function lancarDados3D(lados: number, valores: number[]): Promise<void> {
  if (typeof window === "undefined" || valores.length === 0) {
    return Promise.resolve();
  }
  if (preferiuMenosMovimento()) return Promise.resolve();
  const vez = fila.then(() => animar(lados, valores)).catch(() => {});
  fila = vez;
  return vez;
}

export function lancarD20s3D(valores: number[]): Promise<void> {
  return lancarDados3D(20, valores);
}

/** Pré-carrega o motor (three.js + sons) para a primeira rolagem não travar. */
export function preCarregarDados3D() {
  if (typeof window === "undefined") return;
  void obterCaixa();
}
