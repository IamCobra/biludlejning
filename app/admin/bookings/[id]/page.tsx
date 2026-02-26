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

interface PageProps {
  params: { id: string };
}

export default async function BookingDetailPage({ params }: PageProps) {
  const rawId = params.id ?? "";
  const cleanedId = rawId.replace(/[^0-9]/g, "");

  if (!cleanedId) {
    return (
      <section className="w-full">
        <h1 className="text-xl font-semibold text-zinc-900">
          Ugyldigt booking-id
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Den angivne booking kunne ikke findes. Gå tilbage til oversigten og
          prøv igen.
        </p>
      </section>
    );
  }

  const bookingId = BigInt(cleanedId);

  let booking;
  try {
    booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
  } catch (error) {
    console.error("Booking detail error:", error);
    return (
      <section className="w-full">
        <h1 className="text-xl font-semibold text-zinc-900">
          Fejl ved indlæsning af booking
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Der opstod en fejl under hentning af bookingdata.
        </p>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="w-full">
        <h1 className="text-xl font-semibold text-zinc-900">
          Booking ikke fundet
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Bookingen findes ikke længere. Gå tilbage til oversigten og prøv med
          en anden.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-700">
            Booking #{booking.id.toString()}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Oprettet {booking.createdAt.toLocaleDateString("da-DK")}.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-800">Basisoplysninger</h2>
          <dl className="mt-4 space-y-2 text-sm text-zinc-700">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Biltype</dt>
              <dd className="font-medium">{booking.carType}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Startdato</dt>
              <dd>{booking.startDate.toLocaleDateString("da-DK")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Slutdato</dt>
              <dd>{booking.endDate.toLocaleDateString("da-DK")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Antal dage</dt>
              <dd>{booking.days}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-800">Tilvalg & pris</h2>
          <dl className="mt-4 space-y-2 text-sm text-zinc-700">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">GPS</dt>
              <dd>{booking.gps ? "Ja" : "Nej"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Barnesæde</dt>
              <dd>{booking.childSeat ? "Ja" : "Nej"}</dd>
            </div>
            <div className="flex justify-between gap-4 pt-2">
              <dt className="text-zinc-500">Daglig pris</dt>
              <dd>{formatPrice(booking.dailyPriceOre)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Samlet pris</dt>
              <dd className="font-semibold">{formatPrice(booking.totalPriceOre)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
