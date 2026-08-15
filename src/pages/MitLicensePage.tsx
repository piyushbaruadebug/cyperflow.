import { Link } from "react-router-dom";

export function MitLicensePage() {
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
            MIT License
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            Licensing information for the Pennywise project.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-950">
            MIT License
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            Copyright © 2026 Pennywise Ltd.
          </p>

          <p className="mt-6 leading-8 text-slate-600">
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation
            files, to deal in the software without restriction, including
            without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and sell copies of the software.
          </p>

          <p className="mt-6 leading-8 text-slate-600">
            The software is provided "as is", without warranty of any kind,
            express or implied. In no event shall the authors or copyright
            holders be liable for any claim, damages, or other liability
            arising from the software or its use.
          </p>
        </section>
      </div>
    </div>
  );
}
