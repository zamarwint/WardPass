import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUserSession } from "@/app/actions/getSession";

export const metadata: Metadata = {
  title: "WardPass | Zero-Knowledge Secrets & Credential Vault",
  description:
    "WardPass is an open-source, zero-knowledge credential and secrets management platform with client-side Argon2id key derivation and AES-256-GCM authenticated encryption.",
};

export default async function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['session'],
    queryFn: () => getUserSession(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden no-scrollbar bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <Navbar />
        {children}
        <Footer />
      </div>
    </HydrationBoundary>
  );
}
