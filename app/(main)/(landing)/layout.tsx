import Footer from "@/components//Footer";
import Navbar from "@/components//Navbar";
import type { Metadata } from "next";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUserSession } from "@/app/actions/getSession";

export const metadata: Metadata = {
  title: "WardPass",
  description:
    "What is WardPass? WardPass is a secure password management solution. With WardPass, you can easily organize your passwords into different folders, and use them when you want to sign in to any service.",
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
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden no-scrollbar">
        <Navbar />
        {children}
        <Footer />
      </div>
    </HydrationBoundary>
  );
}
