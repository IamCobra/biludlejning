import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

function formatPrice(ore: number) {
  const kroner = ore / 100;
  return kroner.toFixed(2).replace(".", ",") + " kr";
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="w-full">
      <div className="mb-6 flex items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-700">
          Admin · Bestillinger
        </h1>
        <p className="text-sm text-zinc-500">
          Viser alle gemte bookinger fra databasen.
        </p>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-zinc-600">
          Der er endnu ingen bookinger.
        </p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Oprettet</th>
                <th className="px-4 py-3">Biltype</th>
                <th className="px-4 py-3">Datoer</th>
                <th className="px-4 py-3">Dage</th>
                <th className="px-4 py-3">Tilvalg</th>
                <th className="px-4 py-3">Pris</th>
                <th className="px-4 py-3 text-right">Detaljer</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id.toString()} className="border-t border-zinc-100">
                  <td className="px-4 py-3 align-top text-zinc-700">
                    {b.createdAt.toLocaleDateString("da-DK")}
                  </td>
                  <td className="px-4 py-3 align-top text-zinc-700">
                    {b.carType}
                  </td>
                  <td className="px-4 py-3 align-top text-zinc-600">
                    {b.startDate.toLocaleDateString("da-DK")} – {" "}
                    {b.endDate.toLocaleDateString("da-DK")}
                  </td>
                  <td className="px-4 py-3 align-top text-zinc-600">{b.days}</td>
                  <td className="px-4 py-3 align-top text-zinc-600">
                    {b.gps || b.childSeat ? (
                      <span>
                        {b.gps ? "GPS" : ""}
                        {b.gps && b.childSeat ? ", " : ""}
                        {b.childSeat ? "Barnesæde" : ""}
                      </span>
                    ) : (
                      <span>Ingen</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-zinc-800">
                    {formatPrice(b.totalPriceOre)}
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <Link
                      href={`/admin/bookings/${b.id.toString()}`}
                      className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                    >
                      Se fuld bestilling
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
