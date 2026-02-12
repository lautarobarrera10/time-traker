"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const user = session?.user;

  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="text-sm font-semibold text-slate-700">
          Gaucha App
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              {user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? "Usuario"}
                  className="h-7 w-7 rounded-full border border-slate-200"
                />
              )}
              <span className="max-w-[140px] truncate">
                {user.name ?? user.email}
              </span>
            </div>
          )}

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              if (user) {
                signOut();
              } else {
                signIn("google");
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {!user ? (
              <>
                <span className="inline-block h-4 w-4 rounded-sm bg-white" />
                <span>Entrar con Google</span>
              </>
            ) : (
              <span>Cerrar sesión</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

