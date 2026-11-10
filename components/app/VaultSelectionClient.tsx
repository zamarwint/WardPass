"use client";

import Link from "next/link";
import { RenderIcon } from "@/components/IconMap";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { CustomLoadingState } from "@/components/LoadingStates";
import CreateVault from "@/components/app/vault-crud/CreateVault";
import { useGetVaults } from "@/lib/queries/VaultQueries";

export default function VaultSelectionClient() {
  const { data: vaults, isPending, error } = useGetVaults();
  const vaultList = vaults ?? [];
  const canCreateVault = vaultList.length < 5;

  return (
    <Field className="size-full">
      <FieldContent className="flex flex-col items-center justify-center text-center w-full">
        <FieldSet className="flex flex-col items-center justify-center size-full gap-3">
          <Field className="flex flex-col items-center justify-center w-xl max-h-xl gap-3 text-3xl">
            <FieldLegend className="font-bold text-center">Choose a Vault to View Vault Items</FieldLegend>
            <FieldDescription className="text-center">
              {error
                ? "There was a problem loading your vaults. Please refresh the page."
                : vaultList.length === 0
                  ? "You currently have no vaults. Create one using the 'Create' button below!"
                  : "Choose an existing vault from the options below or create a new one to get started."}
            </FieldDescription>
            <FieldSeparator />
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
        </FieldSet>
      </FieldContent>
    </Field>
  );
}
