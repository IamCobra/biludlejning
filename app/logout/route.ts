import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));

  response.cookies.set("admin", "", {
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
