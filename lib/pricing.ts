export type CarType = "SMALL" | "MIDSIZE" | "VAN";

export interface PriceInput {
  carType: CarType;
  startDate: Date;
  endDate: Date;
  gps: boolean;
  childSeat: boolean;
}

export interface PriceResult {
  days: number;
  dailyPriceOre: number;
  totalPriceOre: number;
}

// beregner i øre for at være sikker på det antal vi får er korrekt uden at skulle bekymre os om decimaler
const CAR_DAILY_ORE: Record<CarType, number> = {
  SMALL: 85000,
  MIDSIZE: 115000,
  VAN: 130000,
};

const GPS_DAILY_ORE = 5000;
const CHILD_SEAT_DAILY_ORE = 5000;

function toUtcDateOnly(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function diffDaysExclusiveEnd(startDate: Date, endDate: Date): number {
  const start = toUtcDateOnly(startDate);
  const end = toUtcDateOnly(endDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
}

export function calculatePrice(input: PriceInput): PriceResult {
  const days = diffDaysExclusiveEnd(input.startDate, input.endDate);
  if (!Number.isFinite(days) || days <= 0) {
    throw new Error(
      "Ugyldig periode: slutdato skal være efter startdato (mindst 1 dag)",
    );
  }
  const baseDaily = CAR_DAILY_ORE[input.carType];
  const addonsDaily =
    (input.gps ? GPS_DAILY_ORE : 0) +
    (input.childSeat ? CHILD_SEAT_DAILY_ORE : 0);

  const dailyPriceOre = baseDaily + addonsDaily;
  const totalPriceOre = dailyPriceOre * days;

  return {
    days,
    dailyPriceOre,
    totalPriceOre,
  };
}
