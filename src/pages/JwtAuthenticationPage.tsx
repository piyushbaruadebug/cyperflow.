export function JwtAuthenticationPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← Back home
          </button>
        </div>

        {/* Header */}
        <div className="mb-14">
          <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-green-800">
            Account & Security
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            JWT Authentication
          </h1>

          <p className="mt-6 max-w-2xl text-xl text-slate-500">
            How sessions and tokens work in Pennywise.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-5">

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex gap-6">
              <span className="text-sm font-semibold text-slate-500">
                01
              </span>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  How a session starts
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-500">
                  Signing in issues a signed JSON Web Token that identifies
                  your account. The token is sent with each request so the
                  server knows who is asking.
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
                  Scope and expiry
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-500">
                  Tokens are short-lived and refreshed while you stay active.
                  Signing out discards the token on your device.
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
                  Data isolation
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-500">
                  Every read and write is filtered by the account in the
                  token, so one account can never see another account&apos;s
                  transactions.
                </p>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}