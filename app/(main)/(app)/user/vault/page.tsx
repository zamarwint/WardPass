import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import Link from 'next/link';
import CreateVault from './../_components/vault/CreateVault';

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldSet,
    FieldTitle,
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

    if (!vaults || vaults.length === 0) {
        return <FieldDescription>No vaults found. Create one above.</FieldDescription>
    }

    const ShowVaults = () => {
        return vaults.map((vault) => (
            <Link key={vault.id} href={`/user/vault/${vault.id}`} className='w-full'>
                <Button size="lg" className="flex items-center p-5 w-full">
                    <DynamicIcon name={vault.icon as IconName} size={32} />
                    <span className="ml-1 text-md font-bold">{vault.name}</span>
                </Button>
            </Link>
        ))
    }


    return (
        <Field className='w-full h-full'>
            <FieldContent className='font-geist flex flex-col items-center justify-center text-center w-full gap-12'>
                <FieldSet className='flex flex-col items-center justify-center w-full gap-3'>
                    <FieldTitle className='text-3xl font-bold'>Select Vault</FieldTitle>
                    <FieldDescription>Choose an existing vault or create a new one to continue.</FieldDescription>
                </FieldSet>
                <div className='flex flex-col items-center justify-center overflow-y-auto w-xl max-h-xl gap-3'>
                    {canCreateVault ? <CreateVault /> : (
                        <FieldDescription>You can only have {maxVaults} vaults. Please delete one to create a new one.</FieldDescription>
                    )}
                    {ShowVaults()}
                </div>
            </FieldContent>
        </Field>
    )
}