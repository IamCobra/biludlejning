"use client";

import { useEffect, useState } from "react";

export function AuthButton() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const hasAdminCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("admin="));
    setIsAdmin(hasAdminCookie);
  }, []);

  const href = isAdmin ? "/logout" : "/login";
  const label = isAdmin ? "Log ud" : "Log ind";

  return (
    <a
      href={href}
      className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-zinc-800 hover:bg-zinc-50"
    >
      {label}
    </a>
  );
}
