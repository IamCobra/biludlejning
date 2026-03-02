import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Brugernavn og adgangskode er påkrævet" },
        { status: 400 },
      );
    }

    const user = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Forkert brugernavn eller adgangskode" },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return NextResponse.json(
        { error: "Forkert brugernavn eller adgangskode" },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin", "1", {
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Noget gik galt" }, { status: 500 });
  }
}
