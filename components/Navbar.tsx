"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "motion/react";
import { ModeToggleIcon } from "./ThemeChange";
import { useGetSession } from "@/lib/queries/SessionQueries";
import UserDropdown from "./app/sidebar/UserDropdown";
import { CustomLoadingState } from "./LoadingStates";
import { cn } from "@/lib/utils";

const links = [
  { label: "How it works", path: "/#how-it-works" },
  { label: "Security", path: "/#security" },
  { label: "Password generator", path: "/password-generator" },
  { label: "Extension", path: "/chrome-extension" },
];

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const session = useGetSession();

  return <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .45 }} className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
    <div className="flex h-[72px] items-center justify-between gap-6">
      <Link href="/" className="flex items-center gap-2.5" aria-label="WardPass home"><Image src="/wp-logo-dark.svg" alt="" width={36} height={36} priority className="size-9 object-contain dark:hidden" /><Image src="/wp-logo-light.svg" alt="" width={36} height={36} priority className="hidden size-9 object-contain dark:block" /><span className="text-lg font-semibold tracking-tight uppercase">wardpass<span className="text-primary">.</span></span></Link>
      <nav className="hidden items-center gap-7 border-x border-border/80 px-7 lg:flex">{links.map(link => <Link key={link.path} href={link.path} className={cn("text-[13px] transition-colors hover:text-primary", pathname === link.path && "text-primary")}>{link.label}</Link>)}</nav>
      <div className="hidden items-center gap-3 lg:flex"><ModeToggleIcon />{session.isPending ? <CustomLoadingState loaderChoice={2} className="text-sm">Loading...</CustomLoadingState> : session.data?.user ? <><Link className="border border-foreground bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-80" href="/strongroom">Open Strongroom</Link><UserDropdown onSidebar={false} /></> : <><Link className="px-3 py-2 text-sm hover:text-primary" href="/sign-in">Log in</Link><Link className="inline-flex items-center gap-2 border border-background bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-80" href="/sign-up">Get started <ArrowUpRight size={15} /></Link></>}</div>
      <button aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)} className="flex size-10 items-center justify-center border border-border lg:hidden">{open ? <X size={19} /> : <Menu size={19} />}</button>
    </div>
    {open && <div className="border-t border-border bg-background px-5 pb-6 pt-3 lg:hidden"><nav className="flex flex-col">{links.map(link => <Link onClick={() => setOpen(false)} key={link.path} href={link.path} className="border-b border-border/70 py-4 text-sm">{link.label}</Link>)}</nav><div className="flex items-center gap-3 pt-5"><ModeToggleIcon /><Link onClick={() => setOpen(false)} className="flex-1 border border-border py-3 text-center text-sm" href={session.data?.user ? "/strongroom" : "/sign-in"}>{session.data?.user ? "Strongroom" : "Log in"}</Link><Link onClick={() => setOpen(false)} className="flex-1 border border-foreground bg-primary py-3 text-center text-sm text-primary-foreground" href="/sign-up">Get started</Link></div></div>}
    <motion.div aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary" style={{ scaleX: scrollYProgress }} />
  </motion.header>;
}
