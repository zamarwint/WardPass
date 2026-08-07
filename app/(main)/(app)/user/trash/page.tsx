import { RenderIcon } from '@/components/IconMap';
import Link from 'next/link';

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { getVaultsAsync } from '@/lib/queries/VaultQueries';

export const metadata: Metadata = {
    title: "Trash Vault Selection",
};

export default async function TrashVaultSelectionPage() {
    const vaults = await getVaultsAsync();
    const noVaults = !vaults || vaults.length === 0;

    const VaultList = () => {
        return vaults!.map((vault) => (
            <Link key={vault.id} href={`/user/trash/${vault.id}`} className='w-full'>
                <Button variant="secondary" size="lg" className="flex items-center p-5 w-full">
                    <RenderIcon name={vault.icon} size={32} color={vault.iconColor ? vault.iconColor : 'white'} />
                    <span className="ml-1 text-md font-bold">{vault.name}</span>
                </Button>
            </Link>
        ))
    }

    return (
        <Field className='w-full h-full'>
            <FieldContent className='font-geist flex flex-col items-center justify-center text-center w-full'>
                <FieldSet className='flex flex-col items-center justify-center size-full gap-5'>
                    <Field className='flex flex-col items-center justify-center w-xl max-h-xl gap-3 text-3xl'>
                        <FieldLegend className='font-bold text-center'>Select Vault</FieldLegend>
                        {noVaults ? (
                            <FieldDescription className='text-center'>No vaults found.</FieldDescription>
                        ) : (
                            <FieldDescription className='text-center'>Choose an existing vault to view trash items.</FieldDescription>
                        )}
                    </Field>
                    <Field className='flex flex-col items-center justify-center overflow-y-auto w-xl max-h-xl gap-3'>
                        {VaultList()}
                    </Field>
                </FieldSet>
            </FieldContent>
        </Field>
    )
}