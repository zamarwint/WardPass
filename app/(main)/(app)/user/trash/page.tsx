import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import Link from 'next/link';

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";
import { getVaults } from '@/app/actions/vault/getVaults';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Trash Vault Selection",
};

export default async function TrashVaultSelectionPage() {
    const vaults = getVaults().then((vaults) => {
        if (!vaults || vaults.length === 0) {
            return <FieldDescription>No vaults found.</FieldDescription>
        }
        return vaults.map((vault) => (
            <Link key={vault.id} href={`/user/trash/${vault.id}`} className='w-full'>
                <Button variant="secondary" size="lg" className="flex items-center p-5 w-full">
                    <DynamicIcon name={vault.icon as IconName} size={32} />
                    <span className="ml-1 text-md font-bold">{vault.name}</span>
                </Button>
            </Link>
        ))
    }).catch((err) => {
        console.log(err)
        return <FieldDescription>Error loading vaults. Please try again later.</FieldDescription>
    })

    return (
        <Field className='w-full h-full'>
            <FieldContent className='font-geist flex flex-col items-center justify-center text-center w-full gap-12'>
                <FieldSet className='flex flex-col items-center justify-center w-full gap-3'>
                    <FieldTitle className='text-3xl font-bold'>Select Vault</FieldTitle>
                    <FieldDescription>Choose an existing vault to view trash items.</FieldDescription>
                </FieldSet>
                <div className='flex flex-col items-center justify-center overflow-y-auto w-xl max-h-xl gap-3'>
                    {vaults}
                </div>
            </FieldContent>
        </Field>
    )
}