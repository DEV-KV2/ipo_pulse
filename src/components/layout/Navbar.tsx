import Link from "next/link";
import { Bell, Bookmark, TrendingUp, Calendar, Shield, Menu, Home, LineChart, PieChart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { auth } from "@/lib/auth";
import { UserNav } from "@/components/layout/user-nav";

export async function Navbar() {
  const session = await auth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center gap-4 lg:gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="hidden sm:flex items-center">
            <span className="font-extrabold text-base md:text-lg leading-none tracking-tight">IPO Pulse</span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex flex-1 justify-end items-center gap-1 mr-2">
          <Link href="/" className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors flex items-center gap-1.5">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link href="/stocks" className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors flex items-center gap-1.5">
            <LineChart className="w-4 h-4" />
            Stocks
          </Link>
          <Link href="/mutual-funds" className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors flex items-center gap-1.5">
            <PieChart className="w-4 h-4" />
            Mutual Funds
          </Link>
          <Link href="/fno" className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            F&O
          </Link>
          <Link href="/calendar" className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            IPO Calendar
          </Link>
          
          {session?.user?.email?.toLowerCase().includes('admin') && (
            <Link href="/admin" className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Actions & Avatar */}
        <div className="flex items-center gap-2 ml-auto">
          


          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hidden sm:flex">
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Profile / Login */}
          <div className="ml-1 pl-3 border-l border-border/50 flex items-center">
            {session?.user ? (
              <UserNav user={session.user} />
            ) : (
              <SignInModal />
            )}
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 ml-1">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
