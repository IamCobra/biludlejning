"use client";

export function AuthButton() {
  const hasAdminCookie = typeof document !== "undefined" && document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("admin="));

  const href = hasAdminCookie ? "/logout" : "/login";
  const label = hasAdminCookie ? "Log ud" : "Log ind";

  return (
    <a
      href={href}
      className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-zinc-800 hover:bg-zinc-50"
    >
      {label}
    </a>
  );
}
