export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background text-foreground/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
        <p className="font-display tracking-[0.3em] text-foreground/70">AURELIA</p>
        <p className="max-w-xl text-center text-xs">
          Aurelia provides educational guidance and market information for foreign investors in Thai
          real estate. It is not a licensed financial or legal advisor and does not guarantee
          returns. Verify all regulations with the Land Department and a licensed Thai lawyer.
        </p>
        <p className="text-xs uppercase tracking-widest">© 2026 · Bangkok</p>
      </div>
    </footer>
  );
}
