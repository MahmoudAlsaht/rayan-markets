"use client";
import { Loader2 } from "lucide-react";
import { createContext, useContext, ReactNode, useTransition } from "react";

type LoadingContextType = {
  startLoading: (cb: Promise<void>) => void;
};

const initial = {
  startLoading: (cb: Promise<void>) => {
    return cb;
  },
};

const LoadingContext = createContext<LoadingContextType>(initial);

export function useStartLoading() {
  return useContext(LoadingContext);
}

type LoadingProviderProps = {
  children: ReactNode;
};

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const [isPending, startTransition] = useTransition();

  const value = {
    startLoading: (cb: Promise<void>) => {
      startTransition(async () => {
        await cb;
      });
    },
  };

  return (
    <LoadingContext.Provider value={value}>
      {!isPending ? (
        children
      ) : (
        <div className="z-100 fixed inset-0 z-50 flex h-screen items-center justify-center bg-gray-100 bg-opacity-75">
          <Loader2 className="size-24 animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light" />
        </div>
      )}
    </LoadingContext.Provider>
  );
}
