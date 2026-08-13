import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "./ModalManager";

export function Layout() {
  return (
    <ModalProvider>
      <LayoutContent />
    </ModalProvider>
  );
}

function LayoutContent() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex flex-col">
      <SiteNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}