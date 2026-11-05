"use client";

import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions-auth";

interface UsuarioMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function UsuarioMenu({ user }: UsuarioMenuProps) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="flex items-center gap-1.5 p-1 rounded-sm border border-black bg-white hover:bg-neutral-100 shadow-[1px_1px_0px_#000] cursor-pointer transition-colors"
        aria-expanded={aberto}
        aria-label="Menu do Usuário"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "Avatar"}
            width={24}
            height={24}
            className="size-6 rounded-full border border-black/40 object-cover"
          />
        ) : (
          <div className="size-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
            {user.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User className="size-3" />
            )}
          </div>
        )}
        <span className="text-xs font-bold text-black max-w-[100px] truncate hidden md:inline">
          {user.name || user.email}
        </span>
      </button>

      {aberto && (
        <div className="absolute right-0 mt-2 w-56 border-2 border-black bg-white shadow-[4px_4px_0px_#000] p-3 text-black z-50 space-y-3">
          <div className="border-b border-black/10 pb-2">
            <p className="text-xs font-black truncate">
              {user.name || "Investigador"}
            </p>
            {user.email && (
              <p className="text-[10px] text-black/60 truncate font-mono">
                {user.email}
              </p>
            )}
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 border border-transparent hover:border-red-300 rounded-sm transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Sair da conta</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
