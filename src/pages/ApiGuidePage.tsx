import { Link } from "react-router-dom";

export function ApiGuidePage() {
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
            API Guide
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            Understand how applications can communicate with Pennywise
            services and work with financial data.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <span className="text-sm font-bold text-slate-400">01</span>
            <h2 className="mt-4 text-xl font-bold text-slate-950">
              Authentication
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Requests should be associated with an authenticated account.
              Authentication helps Pennywise identify the account making a
              request.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <span className="text-sm font-bold text-slate-400">02</span>
            <h2 className="mt-4 text-xl font-bold text-slate-950">
              Requests and responses
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              API requests allow applications to read and work with supported
              financial information while responses provide the requested
              data or an error when something goes wrong.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <span className="text-sm font-bold text-slate-400">03</span>
            <h2 className="mt-4 text-xl font-bold text-slate-950">
              Account isolation
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Financial information is associated with the authenticated
              account so one account cannot access another account's data.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}