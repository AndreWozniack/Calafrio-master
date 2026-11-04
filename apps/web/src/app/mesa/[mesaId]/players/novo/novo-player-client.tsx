"use client";

import { useFichaCalafrio } from "@calafrio/ficha-app";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AssistenteCriacaoCalafrio } from "@/components/ficha/assistente-criacao-calafrio";
import { criarPlayerAction } from "../actions";

export function NovoPlayerClient({ mesaId }: { mesaId: string }) {
  const router = useRouter();
  const f = useFichaCalafrio();
  const [salvando, setSalvando] = useState(false);

  const handleConcluir = async () => {
    if (salvando) return;
    setSalvando(true);
    try {
      const novo = await criarPlayerAction(mesaId, f.ficha);
      if (novo?.id) {
        router.push(`/mesa/${mesaId}/players/${novo.id}/ficha`);
      } else {
        router.push(`/mesa/${mesaId}/players`);
      }
    } catch (e) {
      console.error("Erro ao criar personagem:", e);
      alert("Erro ao salvar o personagem. Verifique se o nome foi preenchido.");
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    router.push(`/mesa/${mesaId}/players`);
  };

  return (
    <AssistenteCriacaoCalafrio
      aberto={true}
      ficha={f.ficha}
      derivada={f.derivada}
      catalogo={f.catalogo}
      onDefinirNome={f.definirNome}
      onDefinirJogador={f.definirJogador}
      onDefinirApt={f.definirApt}
      onAdicionarPalavraChave={f.adicionarPalavraChave}
      onRemoverPalavraChave={f.removerPalavraChave}
      onAlocarSlot={f.alocarSlotMatriz}
      onLimparSlot={f.limparSlotMatriz}
      onAtualizarCarteira={f.definirCarteira}
      onAdicionarItem={f.adicionarItem}
      onRemoverItem={f.removerItem}
      onCancelar={handleCancelar}
      onConcluir={handleConcluir}
      onFechar={handleCancelar}
    />
  );
}
