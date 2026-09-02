import { Link } from "@tanstack/react-router";
import mark from "@/assets/aurelia-mark.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={mark} alt="Aurelia monogram" width={36} height={36} className="size-9" />
          <span className="leading-none">
            <span className="block font-display text-lg tracking-[0.35em] text-foreground">
              AURELIA
            </span>
            <span className="eyebrow mt-1 block text-primary/70">Bangkok · Realty Advisory</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.2em] text-foreground/70 md:flex">
          <a href="/#market" className="transition-colors hover:text-primary">
            Market
          </a>
          <a href="/#insights" className="transition-colors hover:text-primary">
            Insights
          </a>
          <a href="/#compliance" className="transition-colors hover:text-primary">
            Compliance
          </a>
          <Link to="/chat" className="text-primary">
            Speak to Aurelia
          </Link>
        </nav>
      </div>
    </header>
  );
}
