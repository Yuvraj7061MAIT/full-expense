"use client";

import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow-md">
      <h1 className="text-xl font-bold">
        <Link href="/">Finance Tracker+</Link>
      </h1>

      <div className="flex items-center gap-4">
        {!isSignedIn ? (
          <>
            <SignInButton>
              <button className="hover:underline">Login</button>
            </SignInButton>
            <SignUpButton>
              <button className="hover:underline">Sign Up</button>
            </SignUpButton>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
      </div>
    </nav>
  );
};
