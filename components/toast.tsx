"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  Cookie,
  ExternalLink,
  Loader2,
  XCircle,
} from "lucide-react";

type ToastKind = "loading" | "success" | "error" | "info";

interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
  href?: string;
  hrefLabel?: string;
  /** Loading toasts stay until explicitly dismissed. */
  sticky?: boolean;
}

interface ToastApi {
  show: (toast: Omit<Toast, "id">) => number;
  dismiss: (id: number) => void;
}

const AUTO_DISMISS_MS: Record<Exclude<ToastKind, "loading">, number> = {
  info: 5_000,
  success: 7_000,
  error: 8_000,
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside <ToastProvider>");
  return api;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { ...toast, id }].slice(-4));
      if (!toast.sticky) {
        setTimeout(
          () => dismiss(id),
          AUTO_DISMISS_MS[toast.kind as Exclude<ToastKind, "loading">]
        );
      }
      return id;
    },
    [dismiss]
  );

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const icon =
    toast.kind === "success" ? (
      <CheckCircle2 className="size-4 shrink-0 text-neon-mint" />
    ) : toast.kind === "error" ? (
      <XCircle className="size-4 shrink-0 text-red-400" />
    ) : toast.kind === "loading" ? (
      <Loader2 className="size-4 shrink-0 animate-spin text-dough-400" />
    ) : (
      <Cookie className="size-4 shrink-0 text-dough-400" />
    );

  return (
    <button
      type="button"
      onClick={() => onDismiss(toast.id)}
      className="card-glow flex w-full items-start gap-2.5 p-3 text-left text-sm text-slate-200"
    >
      {icon}
      <span className="min-w-0 break-words">
        {toast.text}
        {toast.href && (
          <a
            href={toast.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-1 inline-flex items-center gap-0.5 font-semibold text-neon-cyan hover:underline"
          >
            {toast.hrefLabel ?? "Link"}
            <ExternalLink className="size-3" />
          </a>
        )}
      </span>
    </button>
  );
}