"use client";

import Link from "next/link";
import { RenderIcon } from "@/components/IconMap";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLegend,
} from "@/components/ui/field";
import { CustomLoadingState } from "@/components/LoadingStates";
import CreateVault from "@/components/app/vault-crud/CreateVault";
import { useGetVaults } from "@/lib/queries/VaultQueries";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import React from "react";

function GetStarted() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="size-fit">
      <Carousel className="max-w-4xl" setApi={setApi}>
        <CarouselContent className="p-1">
          <CarouselItem className="basis-1/3">
            <Card className="p-4 select-none">
              <CardTitle>Create your first vault</CardTitle>
              <CardDescription>Create your first vault. You can store service logins, notes big and small, credit card info and even yourself! Yes, you can also add identities.</CardDescription>
              <Button disabled>Create Vault below</Button>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/3">
            <Card className="p-4 select-none">
              <CardTitle>Import Credentials</CardTitle>
              <CardDescription>Migrating to WardPass? No need to worry! Import your credentials as CSV files and WardPass will automatically configure them for you.</CardDescription>
              <Link href="/strongroom/import" className={buttonVariants()}>Import Credentials</Link>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/3">
            <Card className="p-4 select-none">
              <CardTitle>Try out the Playground!</CardTitle>
              <CardDescription>Have free time to spare? Try out the WardPass Playground area where you can play around with fake cards and other objects.</CardDescription>
              <Link href="/strongroom/playground" className={buttonVariants()}>Open Playground</Link>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/3">
            <Card className="p-4 select-none">
              <CardTitle>Lock up when ready</CardTitle>
              <CardDescription>Lock up your vaults whenever you are away from your computer! Remember: Keep your credentials safe at all times.</CardDescription>
              <Button disabled>Lock WardPass on sidebar</Button>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default function VaultSelectionClient() {
  const { data: vaults, isPending, error } = useGetVaults();
  const user = useGetSession();
  const vaultList = vaults ?? [];
  const canCreateVault = vaultList.length < 5;

  return (
    <ResizablePanelGroup orientation="vertical">
      <ResizablePanel defaultValue="50%" className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-center font-bold text-4xl">Welcome to your <span className="text-primary">Strongroom,</span> {user.data?.user.name}!</h1>
          <p className="text-center text-muted-foreground">We are glad to have you here.</p>
        </div>
        <GetStarted />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize="50%" className="flex flex-col items-center justify-center gap-6">
        <Field className="flex flex-col items-center justify-center w-xl max-h-xl gap-3 text-3xl">
          <FieldLegend className="font-bold text-center">Choose a Vault to View Vault Items</FieldLegend>
          <FieldDescription className="text-center">
            {error
              ? "There was a problem loading your vaults. Please refresh the page."
              : vaultList.length === 0
                ? "You currently have no vaults. Create one using the 'Create' button below!"
                : "Choose an existing vault from the options below or create a new one to get started."}
          </FieldDescription>
        </Field>
        <Field className="flex flex-col items-center justify-center overflow-y-auto no-scrollbar w-xl max-h-xl gap-3">
          {isPending ? (
            <CustomLoadingState loaderChoice={1} className="flex items-center justify-center gap-2">
              <span className="shimmer shimmer-duration-1000">Loading...</span>
            </CustomLoadingState>
          ) : (
            <>
              <CreateVault disabled={!canCreateVault || Boolean(error)} />
              {vaultList.map((vault) => (
                <Link key={vault.id} href={`/strongroom/${vault.id}`} className="w-full">
                  <Button size="lg" className="flex items-center p-5 w-full">
                    <RenderIcon name={vault.icon} size={32} color={vault.iconColor ?? "white"} />
                    <span className="ml-1 text-md font-bold">{vault.name}</span>
                  </Button>
                </Link>
              ))}
            </>
          )}
        </Field>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
