"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, useContext, ReactNode, useTransition } from "react";

type LoadingContextType = {
  startLoading: (cb: any) => void;
};

const LoadingContext = createContext<LoadingContextType>({
  startLoading: (cb: any) => {},
});

export function useStartLoading() {
  return useContext(LoadingContext);
}

type LoadingProviderProps = {
  children: ReactNode;
};

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const [isPending, startTransition] = useTransition();

  const value = {
    startLoading: (cb: () => any) => {
      startTransition(async () => {
        await cb();
      });
    },
  };

  return (
    <LoadingContext.Provider value={value}>
      {
        <>
          {isPending ? (
            <section className="flex flex-col">
              <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-white opacity-80">
                <Loader2 className="size-24 animate-spin text-rayanPrimary-dark" />
              </div>
              <main>{children}</main>
            </section>
          ) : (
            children
          )}
        </>
      }
    </LoadingContext.Provider>
  );
}

export function LoadingLink({
  href,
  className,
  children,
  type = "link",
}: {
  href: string | (() => void);
  className?: string;
  children: ReactNode;
  type?: string;
}) {
  const router = useRouter();
  const { startLoading } = useStartLoading();

  const handleStartLoading = () =>
    startLoading(() => {
      if (typeof href === "function") href();
      else router.push(href);
    });

  return type === "link" ? (
    <div className={`cursor-pointer ${className}`} onClick={handleStartLoading}>
      {children}
    </div>
  ) : (
    (type === "button" || type === "submit") && (
      <Button type={type} className={`cursor-pointer ${className}`} size="icon">
        {children}
      </Button>
    )
  );
}
