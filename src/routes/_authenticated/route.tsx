import { useEffect, useRef } from "react";
import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const href = useRouterState({ select: (state) => state.location.href });
  const initialHref = useRef(href);
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || session || redirected.current) return;
    redirected.current = true;
    navigate({ to: "/auth", search: { redirect: initialHref.current }, replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="eyebrow text-primary/70">Opening the advisory room…</p>
      </div>
    );
  }

  return <Outlet />;
}
