"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-fuchsia-200 bg-white/80 backdrop-blur items-center">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-fuchsia-900">
              🐿️ Serene
            </span>
          </Link>
        </div>

        <Avatar className="h-8 w-8 border border-fuchsia-200 flex">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-fuchsia-100 text-fuchsia-700">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
