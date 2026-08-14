"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  // Lazy initial state function ensures makeStore() is only invoked once per client instance
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
