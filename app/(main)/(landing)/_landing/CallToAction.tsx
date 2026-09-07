"use client";

import { CustomLoadingState } from "@/app/_components/LoadingStates";
import { Button } from "@/components/ui/button";
import { useGetSession } from "@/lib/queries/SessionQueries";
import Link from "next/link";

// CALL TO ACTION

export default function CallToAction() {
  const { isPending, data, error } = useGetSession();

  return (
    <section className="py-30 border-y border-foreground/5">
      <div className="mx-auto">
        <div className="p-12 text-center max-w-4xl mx-auto border border-foreground/20 hover:border-primary/50 bg-card">
          <h2 className="text-2xl md:text-4xl font-bold font-geist mb-6">
            Ready to secure your assets?
          </h2>
          <p className="mb-10 max-w-2xl mx-auto text-muted-foreground">
            Join thousands of power users who trust WardPass with their most
            sensitive digital credentials.
          </p>
          <Button
            variant={error ? "destructive" : "default"}
            className="tracking-wider uppercase py-8 px-10"
            size="lg"
            disabled={isPending}
          >
            <Link
              href={data?.user ? "/user/vault" : "/sign-up"}
              className="flex items-center justify-center"
            >
              {isPending ? (
                <CustomLoadingState loaderChoice={2} className="size-full flex items-center justify-center gap-2">
                  <span className="shimmer shimmer-duration-1000"> Loading... </span>
                </CustomLoadingState>
              ) : data?.user ? (
                <span>Back to Dashboard</span>
              ) : (
                <span>Try WardPass</span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
