"use client";

import { CustomLoadingState } from "../LoadingStates";
import { Button } from "@/components/ui/button";
import { useGetSession } from "@/lib/queries/SessionQueries";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  const { isPending, data } = useGetSession();
  return <section className="landing-section pb-20 md:pb-28"><div className="landing-shell"><div className="relative grid gap-8 border border-foreground/25 bg-foreground px-7 py-10 text-background md:grid-cols-[1fr_auto] md:items-end md:px-12 md:py-14"><div className="absolute inset-y-0 left-0 w-1 bg-primary"/><div><p className="eyebrow relative mb-5 text-background/65">WARDPASS / GET STARTED</p><h2 className="landing-display relative max-w-2xl text-4xl leading-tight md:text-5xl">A better place for the passwords you rely on.</h2><p className="relative mt-5 max-w-xl text-sm leading-6 text-background/70">Create a WardPass account and start organizing your credentials in personal vaults.</p></div><Button asChild size="lg" variant="secondary" disabled={isPending} className="relative w-fit rounded-none px-6">{isPending ? <span className="flex items-center gap-2"><CustomLoadingState loaderChoice={2} className="flex items-center gap-2">Loading...</CustomLoadingState></span> : <Link href={data?.user ? "/strongroom" : "/sign-up"}>{data?.user ? "Open your Strongroom" : "Get started with WardPass"}<ArrowRight/></Link>}</Button></div></div></section>;
}
