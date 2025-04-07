"use client"

import { useState } from "react"
import Link from "next/link"
import { default as BoringAvatar } from "boring-avatars"
import { LogOut, User, EyeOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isAnonymous, setIsAnonymous] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-fuchsia-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-fuchsia-900">🐿️ MindfulMe</span>
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-8 w-8 border border-fuchsia-200 flex cursor-pointer hover:ring-2 hover:ring-fuchsia-200 transition-all">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-fuchsia-100 text-fuchsia-700">
                <BoringAvatar name="test" variant="beam" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-white" onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuCheckboxItem 
              checked={isAnonymous} 
              onCheckedChange={setIsAnonymous}
              className="cursor-pointer"
              onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center">
                <EyeOff className="mr-2 h-4 w-4" />
                <div>
                  <div className="text-sm">Connect Anonymously</div>
                  <p className="text-xs text-muted-foreground">Hide identity on the discover page</p>
                </div>
              </div>
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

