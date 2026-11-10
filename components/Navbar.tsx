"use client";

import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "motion/react";
import { LogoSwitch, ModeToggleIcon } from "./ThemeChange";
import { useGetSession } from "@/lib/queries/SessionQueries";
import UserDropdown from "./app/sidebar/UserDropdown";
import { CustomLoadingState } from "./LoadingStates";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { label: "Features", path: "/#features" },
  { label: "Architecture", path: "/security-whitepaper" },
  { label: "Interactive Demo", path: "/#interactive-demo" },
  { label: "Password Generator", path: "/password-generator" },
  { label: "Extension", path: "/chrome-extension" },
];

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const session = useGetSession();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl"
    >
      <div className="landing-shell flex h-17.5 items-center justify-between gap-6">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="WardPass home">
          <LogoSwitch />
          <span className="text-base font-semibold tracking-tight text-foreground uppercase flex items-center gap-1">
            WardPass
            <span className="text-primary text-lg leading-none">.</span>
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "text-xs font-mono tracking-wide text-muted-foreground hover:text-foreground transition-colors py-1",
                pathname === link.path && "text-primary font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">
          <ModeToggleIcon />

          {session.isPending ? (
            <CustomLoadingState loaderChoice={2} className="text-xs text-muted-foreground">
              Loading...
            </CustomLoadingState>
          ) : session.data?.user ? (
            <>
              <Link href="/strongroom" className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}>Open Strongroom</Link>
              <UserDropdown onSidebar={false} />
            </>
          ) : (
            <>
              <Link
                className="px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                href="/sign-in"
              >
                Sign In
              </Link>
              <Link href="/sign-up" className={cn("flex items-center gap-1.5", buttonVariants({ size: "sm" }))}>
                <span>Get Started</span>
                <ArrowRight className="size-3" />
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted lg:hidden cursor-pointer"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="border-t border-border bg-background px-6 pb-6 pt-3 lg:hidden shadow-lg">
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                onClick={() => setOpen(false)}
                key={link.path}
                href={link.path}
                className="border-b border-border/50 py-3 text-sm font-mono text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 pt-5">
            <ModeToggleIcon />
            <Link
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-border py-2.5 text-center text-xs text-foreground hover:bg-muted"
              href={session.data?.user ? "/strongroom" : "/sign-in"}
            >
              {session.data?.user ? "Strongroom" : "Sign In"}
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-primary py-2.5 text-center text-xs font-medium text-primary-foreground hover:bg-primary/90"
              href="/sign-up"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* SCROLL PROGRESS INDICATOR */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-linear-to-r from-primary to-amber-300"
        style={{ scaleX: scrollYProgress }}
      />
    </motion.header>
  );
}
