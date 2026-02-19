"use client";

import { useState } from "react";

export default function BookingPage() {
  const [form, setForm] = useState({
    carType: "SMALL",
    startDate: "",
    endDate: "",
    gps: false,
    childSeat: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Fejl");
      return;
    }

    alert("Booking oprettet! Total (øre): " + data.totalPriceOre);
  }

  return (
    <section className="grid w-full gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Bestil din bil
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Vælg biltype, periode og ekstraudstyr. Prisen beregnes automatisk.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">
              Biltype
            </label>
            <select
              value={form.carType}
              onChange={(e) =>
                setForm({ ...form, carType: e.target.value })
              }
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
            >
              <option value="SMALL">Mindre bil</option>
              <option value="MIDSIZE">Mellemklasse</option>
              <option value="VAN">Varevogn</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">
                Startdato
              </label>
              <input
                type="date"
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                required
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">
                Slutdato
              </label>
              <input
                type="date"
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                required
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900">
              <input
                type="checkbox"
                onChange={(e) =>
                  setForm({ ...form, gps: e.target.checked })
                }
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
              />
              <span>GPS</span>
            </label>

            <label className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900">
              <input
                type="checkbox"
                onChange={(e) =>
                  setForm({ ...form, childSeat: e.target.checked })
                }
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
              />
              <span>Barnesæde</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 active:scale-[0.99]"
            >
              Bestil bil
            </button>
          </div>
        </form>
      </div>

      <aside className="hidden md:block rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
        <h2 className="text-sm font-semibold tracking-[0.18em] text-zinc-600 uppercase">
          Overblik
        </h2>
        <p className="mt-3 text-sm text-zinc-600">
          Når du vælger periode og ekstraudstyr, beregner vi samlet pris
          automatisk og gemmer din booking i systemet.
        </p>
        <div className="mt-6 space-y-3 text-sm text-zinc-400">
          <div className="flex items-center justify-between">
            <span>Biltyper</span>
            <span className="text-zinc-800">SMALL · MIDSIZE · VAN</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Ekstraudstyr</span>
            <span className="text-zinc-800">GPS, barnesæde</span>
          </div>
          <div className="h-px bg-zinc-200" />
          <p className="text-xs text-zinc-500">
            Projektet bruger Prisma + PostgreSQL til at gemme alle bookinger og
            sikre konsistente priser.
          </p>
        </div>
      </aside>
    </section>
  );
}
