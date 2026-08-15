import { NavLink } from "react-router-dom";
import { ArrowUpRight, Globe, Wallet } from "lucide-react";

type FooterLink = { label: string; to: string; hash?: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Expense Tracking",
    links: [
      { label: "Add transaction", to: "/features", hash: "expense-tracking" },
      { label: "Category breakdown", to: "/features", hash: "expense-tracking" },
      { label: "Search & filter", to: "/features", hash: "expense-tracking" },
      { label: "Monthly history", to: "/features", hash: "expense-tracking" },
      { label: "CSV Export", to: "/features", hash: "expense-tracking" },
    ],
  },
  {
    title: "Budgeting Tools",
    links: [
      { label: "Monthly limits", to: "/features", hash: "budgeting-tools" },
      { label: "Category budget", to: "/features", hash: "budgeting-tools" },
      { label: "Savings target", to: "/features", hash: "budgeting-tools" },
      { label: "Budget alerts", to: "/features", hash: "budgeting-tools" },
      { label: "Auto recalculate", to: "/features", hash: "budgeting-tools" },
    ],
  },
  {
    title: "Financial Insights",
    links: [
      { label: "Spending charts", to: "/features", hash: "financial-insights" },
      { label: "Trend comparison", to: "/features", hash: "financial-insights" },
      { label: "Financial assistant", to: "/features", hash: "financial-insights" },
      { label: "Average transaction", to: "/features", hash: "financial-insights" },
      { label: "Monthly reports", to: "/features", hash: "financial-insights" },
    ],
  },
  {
    title: "Account & Security",
    links: [
      { label: "Account profile", to: "/account" },
      { label: "Reset password", to: "/reset-password" },
      { label: "JWT Authentication", to: "/jwt-authentication" },
      { label: "Data privacy", to: "/data-privacy" },
      { label: "Encrypted password", to: "/encrypted-password" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/documentation" },
      { label: "API Guide", to: "/api-guide" },
      { label: "Help Center", to: "/help" },
      { label: "Community", to: "/community" },
      { label: "MIT License", to: "/mit-license" },
    ],
  },
];

const LEGAL: FooterLink[] = [
  { label: "Overview", to: "/overview" },
  { label: "Features", to: "/features" },
  { label: "Security", to: "/security" },
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/privacy" },
  { label: "Cookies", to: "/cookies" },
  { label: "Help", to: "/help" },
];

function FooterItem({ link }: { link: FooterLink }) {
  const to = link.hash ? `${link.to}#${link.hash}` : link.to;

  return (
    <NavLink
      to={to}
      className="group inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink-foreground"
    >
      <span className="border-b border-transparent pb-px transition-colors group-hover:border-accent">
        {link.label}
      </span>
    </NavLink>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_3fr]">
          <div className="max-w-sm">
            <NavLink to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Wallet className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl font-bold">Pennywise</span>
            </NavLink>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted">
              Track every expense, set smarter budgets, and let your financial assistant do the
              math.
            </p>
            <NavLink
              to="/overview"
              className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.03]"
            >
              Take the tour <ArrowUpRight className="h-4 w-4" />
            </NavLink>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-foreground/70">
                  {column.title}
                </h3>
                <ul className="space-y-3.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <FooterItem link={link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-ink-border pt-7 text-sm text-ink-muted sm:flex-row">
          <p>© 2026 Pennywise Ltd. All rights reserved</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {LEGAL.map((link) => (
              <FooterItem key={link.label} link={link} />
            ))}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-border px-3 py-1 text-xs font-medium text-ink-foreground">
              <Globe className="h-3.5 w-3.5" /> English
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
