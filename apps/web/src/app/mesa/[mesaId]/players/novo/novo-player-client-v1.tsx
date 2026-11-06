"use client";

import { useFichaCalafrioV1 } from "@calafrio/ficha-app";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AssistenteCriacaoV1 } from "@/components/ficha/criacao-v1/assistente-criacao-v1";
import { criarPlayerAction, salvarFichaPlayerAction } from "../actions";

export function NovoPlayerClientV1({
  mesaId,
  rascunhoId,
}: {
  mesaId: string;
  rascunhoId?: string;
}) {
  const router = useRouter();
  const f = useFichaCalafrioV1();
  const [salvando, setSalvando] = useState(false);

  const handleConcluir = async () => {
    if (salvando) return;
    setSalvando(true);
    try {
      const novo = rascunhoId
        ? await salvarFichaPlayerAction(rascunhoId, {
            ...f.ficha,
            id: rascunhoId,
          })
        : await criarPlayerAction(mesaId, f.ficha);
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
    <AssistenteCriacaoV1
      aberto={true}
      ficha={f.ficha}
      derivada={f.derivada}
      onDefinirNome={f.definirNome}
      onDefinirJogador={f.definirJogador}
      onDefinirQuemSouEu={f.definirQuemSouEu}
      onDefinirAtributo={f.definirAtributo}
      onAdicionarPalavraChave={f.adicionarPalavraChave}
      onRemoverPalavraChave={f.removerPalavraChave}
      onMemorizarHabilidade={f.memorizarHabilidade}
      onEsquecerHabilidade={f.esquecerHabilidade}
      onDefinirCarteira={f.definirCarteira}
      onAdicionarItem={f.adicionarItem}
      onRemoverItem={f.removerItem}
      onCancelar={handleCancelar}
      onConcluir={handleConcluir}
      onFechar={handleCancelar}
    />
  );
}
