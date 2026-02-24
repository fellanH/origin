import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { PluginContext } from "./plugin";

const Context = createContext<PluginContext | null>(null);

export function PluginContextProvider({
  value,
  children,
}: {
  value: PluginContext;
  children: ReactNode;
}) {
  return <Context value={value}>{children}</Context>;
}

export function usePluginContext(): PluginContext {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error(
      "usePluginContext must be called inside a plugin rendered by Origin",
    );
  }
  return ctx;
}
