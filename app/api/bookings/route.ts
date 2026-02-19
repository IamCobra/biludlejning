import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { calculatePrice } from "@/lib/pricing";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { carType, startDate, endDate, gps, childSeat } = body;

    if (!carType || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Manglende påkrævede felter." },
        { status: 400 },
      );
    }

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);

    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return NextResponse.json({ error: "Ugyldige datoer." }, { status: 400 });
    }

    const priceResult = calculatePrice({
      carType,
      startDate: parsedStart,
      endDate: parsedEnd,
      gps: Boolean(gps),
      childSeat: Boolean(childSeat),
    });

    const booking = await prisma.booking.create({
      data: {
        carType,
        startDate: parsedStart,
        endDate: parsedEnd,
        gps: Boolean(gps),
        childSeat: Boolean(childSeat),
        days: priceResult.days,
        dailyPriceOre: priceResult.dailyPriceOre,
        totalPriceOre: priceResult.totalPriceOre,
      },
    });

    const safeBooking = {
      ...booking,
      id: Number(booking.id),
    };

    return NextResponse.json(safeBooking, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    const message = error instanceof Error ? error.message : "Ukendt fejl";
    return NextResponse.json(
      { error: "Noget gik galt.", details: message },
      { status: 500 },
    );
  }
}
