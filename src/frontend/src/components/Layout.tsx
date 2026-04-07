import { Link, useRouterState } from "@tanstack/react-router";
import { Music2 } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const NAV_LINKS = [
  { to: "/", label: "Create", ocid: "nav-create" },
  { to: "/library", label: "Library", ocid: "nav-library" },
] as const;

export function Layout({ children }: LayoutProps) {
  const { location } = useRouterState();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-border bg-card shadow-[0_1px_0_0_oklch(0.25_0_0)]"
        data-ocid="nav"
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-ocid="nav-logo"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-primary transition-smooth group-hover:opacity-90">
              <Music2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-[17px] font-bold tracking-tight text-foreground">
              LyricBeats
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, ocid }) => {
              const isActive =
                to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  data-ocid={ocid}
                  className={[
                    "rounded-[3px] px-4 py-1.5 font-display text-sm font-medium tracking-wide transition-smooth",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-4">
        <p className="text-center font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-primary"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
