"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 text-lg font-semibold bg-white text-black rounded-lg transition hover:bg-gray-300"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 text-lg font-semibold border border-white rounded-lg transition hover:bg-white hover:text-black"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
