"use client";

import {
  carregarCatalogoCalafrio,
  type ItemNaFichaCalafrio,
} from "@calafrio/core";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AbasModal, type AbaModal } from "./modais/abas-modal";
import { BibliotecaArsenal } from "./modais/biblioteca-arsenal";
import {
  BotaoPrincipal,
  BotaoSecundario,
  CascaModal,
} from "./modais/casca-modal";
import {
  type FormItem,
  formularioItemInicial,
  formularioParaItem,
} from "./modais/form-item";
import { FormItemManual } from "./modais/form-item-manual";

interface Props {
  aberto: boolean;
  inicial?: ItemNaFichaCalafrio;
  onSalvar: (item: ItemNaFichaCalafrio) => void;
  onFechar: () => void;
}

export function ModalItem({ aberto, inicial, onSalvar, onFechar }: Props) {
  if (!aberto) return null;
  return <ConteudoModalItem inicial={inicial} onSalvar={onSalvar} onFechar={onFechar} />;
}

function ConteudoModalItem({
  inicial,
  onSalvar,
  onFechar,
}: Omit<Props, "aberto">) {
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);
  const [aba, setAba] = useState<AbaModal>(inicial ? "manual" : "biblioteca");
  const [form, setForm] = useState<FormItem>(() =>
    formularioItemInicial(inicial),
  );

  const atualizar = (mudanca: Partial<FormItem>) =>
    setForm((atual) => ({ ...atual, ...mudanca }));

  const escolherDaBiblioteca = (mudanca: Partial<FormItem>) => {
    atualizar(mudanca);
    setAba("manual");
  };

  const salvar = () => {
    if (!form.nome.trim()) return;
    onSalvar(formularioParaItem(form, inicial));
    onFechar();
  };

  return (
    <CascaModal
      titulo={inicial ? "Editar item" : "Novo item"}
      onFechar={onFechar}
      rodape={
        <>
          <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
          <BotaoPrincipal disabled={!form.nome.trim()} onClick={salvar}>
            <Plus className="size-5" strokeWidth={3} />
            {inicial ? "Salvar alterações" : "Adicionar item"}
          </BotaoPrincipal>
        </>
      }
    >
      <div className="space-y-4">
        <AbasModal aba={aba} onMudar={setAba} />
        {aba === "biblioteca" ? (
          <BibliotecaArsenal
            catalogo={catalogo}
            onEscolher={escolherDaBiblioteca}
          />
        ) : (
          <FormItemManual valor={form} onChange={atualizar} />
        )}
      </div>
    </CascaModal>
  );
}
