import { Link } from "react-router-dom";

export function HelpCenterPage() {
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
            Pennywise Support
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950">
            Help Center
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            Find answers to common questions about your Pennywise account,
            expenses, budgets, and security.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-bold text-slate-950">
              Account help
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Learn how to manage your account, sign in, reset your password,
              and keep your account secure.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-bold text-slate-950">
              Expense tracking
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Learn how to add transactions, organize expenses, and review
              your spending history.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-bold text-slate-950">
              Budgets
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Get help creating budgets, setting limits, and tracking your
              monthly financial goals.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-bold text-slate-950">
              Security
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Understand authentication, account protection, privacy, and
              secure handling of your information.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}