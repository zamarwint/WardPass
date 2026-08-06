import { RenderIcon } from '@/components/IconMap';
import Link from 'next/link';
import CreateVault from './../_components/vault/CreateVault';

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { getVaultsAsync } from '@/lib/queries/VaultQueries';

export const metadata: Metadata = {
    title: "Select Vault",
};

export default async function VaultSelectionPage() {
    const maxVaults = 3;
    const vaults = await getVaultsAsync();
    const vaultCount = vaults!.length;
    const canCreateVault = vaultCount < maxVaults;

    const noVaults = !vaults || vaults.length === 0;

    const ShowVaults = () => {
        return vaults!.map((vault) => (
            <Link key={vault.id} href={`/user/vault/${vault.id}`} className='w-full'>
                <Button size="lg" className="flex items-center p-5 w-full">
                    <RenderIcon name={vault.icon} size={32} />
                    <span className="ml-1 text-md font-bold">{vault.name}</span>
                </Button>
            </Link>
        ))
    }


    return (
        <Field className='w-full h-full'>
            <FieldContent className='font-geist flex flex-col items-center justify-center text-center w-full'>
                <FieldSet className='flex flex-col items-center justify-center size-full gap-3'>
                    <Field className='flex flex-col items-center justify-center w-xl max-h-xl gap-3 text-3xl'>
                        <FieldLegend className='font-bold text-center'>Select Vault</FieldLegend>
                        {noVaults ? (
                            <FieldDescription className='text-center'>No vaults found. Create one below.</FieldDescription>
                        ) : (
                            <FieldDescription className='text-center'>Choose an existing vault or create a new one below to continue.</FieldDescription>
                        )}
                        <FieldSeparator />
                    </Field>
                    <Field className='flex flex-col items-center justify-center overflow-y-auto w-xl max-h-xl gap-3'>
                        {canCreateVault ? <CreateVault disabled={false} /> : <CreateVault disabled={true} />}
                        {ShowVaults()}
                    </Field>
                </FieldSet>
            </FieldContent>
        </Field>
    )
}