import { NavLink, useNavigate } from "react-router-dom";
import { Bot, LogOut, Menu, Wallet, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "../store/appContext";

const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Add Expense", to: "/add" },
  { label: "History", to: "/history" },
  { label: "Budget", to: "/budget" },
  { label: "Pennywise AI", to: "/chat" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        <NavLink to="/dashboard" className="inline-flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Wallet className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold">Pennywise</span>
        </NavLink>

        <nav className="hidden items-center gap-5 lg:gap-7 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <NavLink
            to="/account"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Account
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
          <NavLink
            to="/chat"
            className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.03]"
          >
            <Bot className="mr-1.5 h-4 w-4" />
            AI Agent
          </NavLink>
        </div>

        <button
          onClick={() => setOpen((s) => !s)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4">
              <NavLink
                to="/account"
                onClick={() => setOpen(false)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Account
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-left text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Log out {user?.name ? `(${user.name})` : ""}
              </button>
              <NavLink
                to="/chat"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground"
              >
                <Bot className="mr-1.5 h-4 w-4" />
                Open Pennywise AI
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
