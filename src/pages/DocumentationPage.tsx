import { Link } from "react-router-dom";

export function DocumentationPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fc] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back home
        </Link>

        <div className="mb-12">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Pennywise Resources
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950">
            Documentation
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            Learn how Pennywise works and how to use every part of your
            personal finance workspace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <div className="mb-6 text-sm font-bold text-slate-400">01</div>
            <h2 className="text-xl font-bold text-slate-950">
              Getting started
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Create your account, add your first expense, and start
              understanding your spending.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <div className="mb-6 text-sm font-bold text-slate-400">02</div>
            <h2 className="text-xl font-bold text-slate-950">
              Managing expenses
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Add transactions, organize categories, search your history, and
              review your spending.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <div className="mb-6 text-sm font-bold text-slate-400">03</div>
            <h2 className="text-xl font-bold text-slate-950">
              Budgeting
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Set category budgets, track limits, and keep your monthly
              spending under control.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}