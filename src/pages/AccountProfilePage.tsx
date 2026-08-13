export function AccountProfilePage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← Back home
          </button>
        </div>

        <div className="mb-14">
          <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-green-800">
            Account & Security
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Account Profile
          </h1>

          <p className="mt-6 max-w-2xl text-xl text-slate-500">
            Manage your Pennywise account and keep your personal information up to date.
          </p>
        </div>

        <div className="space-y-5">

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex gap-6">
              <span className="text-sm font-semibold text-slate-500">
                01
              </span>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Your account
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-500">
                  Your Pennywise account keeps your financial information
                  connected to your personal profile. Your account is used to
                  identify your transactions, budgets, and financial activity.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex gap-6">
              <span className="text-sm font-semibold text-slate-500">
                02
              </span>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Profile information
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-500">
                  Keep your account information accurate so that your Pennywise
                  experience remains consistent across the application.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex gap-6">
              <span className="text-sm font-semibold text-slate-500">
                03
              </span>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Account security
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-500">
                  Your account works together with authentication and password
                  protection features to help keep your financial information
                  private.
                </p>
              </div>
            </div>
          </section>

        </div>

        <div className="mt-10 rounded-3xl bg-slate-950 p-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
              Pennywise
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Keep your financial profile organised.
            </h2>
          </div>

          <button
            onClick={() => window.history.back()}
            className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 sm:mt-0"
          >
            Back to Pennywise →
          </button>
        </div>

      </div>
    </div>
  )
}