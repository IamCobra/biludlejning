export default function Home() {
  return (
    <section className="w-full">
      <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Velkommen til Biludlejning
        </h1>
        <p className="mt-3 text-sm text-zinc-600 max-w-xl">
          Her kan du bestille en bil til en bestemt periode og vælge ekstraudstyr.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/booking"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Gå til booking
          </a>
        </div>
      </div>
    </section>
  );
}
